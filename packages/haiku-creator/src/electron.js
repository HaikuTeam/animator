import * as EventEmitter from 'events';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import {parse} from 'url';
import {inherits} from 'util';

import {BrowserWindow, app, ipcMain, protocol, systemPreferences, session} from 'electron';
import * as ElectronProxyAgent from 'electron-proxy-agent';
import * as qs from 'qs';

import {isProxied, ProxyType} from 'haiku-common/lib/proxies';
import TopMenu from 'haiku-common/lib/electron/TopMenu';
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';
import * as ensureTrailingSlash from 'haiku-serialization/src/utils/ensureTrailingSlash';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import {isMac} from 'haiku-common/lib/environments/os';

if (!app) {
  throw new Error('You can only run electron.js from an electron process');
}

app.setName('Haiku Animator');
app.setAsDefaultProtocolClient('haiku');

// Haiku main window
let browserWindow = null;

const handleUrl = (url) => {
  if (!browserWindow) {
    logger.warn(`[creator] unable to handle custom protocol URL ${url}; browserWindow not ready`);
    return;
  }
  logger.info(`[creator] handling custom protocol URL ${url}`);
  const parsedUrl = parse(url);
  browserWindow.webContents.send(`open-url:${parsedUrl.host}`, parsedUrl.pathname, qs.parse(parsedUrl.query));
};

// Handle haiku:// protocol on Windows and Linux
if (!isMac()) {
  const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
    logger.info(`[creator] Received command line on second instance ${commandLine}`);

    // Handle haiku:// protocol on second instance
    for (const arg of commandLine) {
      if (arg.startsWith('haiku://')) {
        handleUrl(arg);
        break;
      }
    }

    // Someone tried to run a second instance, we should focus our window.
    if (browserWindow) {
      if (browserWindow.isMinimized()) {
        browserWindow.restore();
      }
      browserWindow.focus();
    }
  });

  // Only quit second instance if it would handle haiku:// protocol (simulate Mac OS behavior)
  if (isSecondInstance && global.process.env.HAIKU_INITIAL_URL) {
    app.quit();
  }
}

// Disable "Start Dictation" and "Emoji & Symbols" menu items on MAC
if (isMac()) {
  systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true);
  systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true);
}

app.on('login', (event, webContents, request, authInfo, authenticate) => {
  // We are currently not equipped to authenticate requests that are intercepted by a proxy but require login
  // credentials when we encounter interference at this stage. When this functionality is added:
  //   - `event.preventDefault()` will prevent the default behavior of Electron blocking the request.
  //   - Invoking the callback like `authenticate(username, password)` should allow the authenticated-proxied request
  //     through.
  // For now, log the authorization info so we can at least see what's going on.
  logger.warn('[unexpected proxy interference]', authInfo);
});

// See bottom
function CreatorElectron () {
  EventEmitter.apply(this);
}
inherits(CreatorElectron, EventEmitter);
const creator = new CreatorElectron();

const appUrl = 'file://' + path.join(__dirname, '..', 'index.html');

// Plumbing starts up this process, and it uses HAIKU_ENV to forward to us data about
// how it has been set up, e.g. what ports it is using for websocket server, envoy, etc.
// This is sent into the DOM part of the app at did-finish load; see below.
const haiku = global.process.env.HAIKU_ENV
  ? JSON.parse(global.process.env.HAIKU_ENV)
  : {};

if (!haiku.folder) {
  haiku.folder = global.process.env.HAIKU_PROJECT_FOLDER;
}

app.on('window-all-closed', () => {
  app.quit();
});

if (!haiku.plumbing) {
  haiku.plumbing = {};
}

if (!haiku.plumbing.url) {
  if (global.process.env.NODE_ENV !== 'test' && !global.process.env.HAIKU_PLUMBING_PORT) {
    throw new Error(`Oops! You must define a HAIKU_PLUMBING_PORT env var!`);
  }

  // tslint:disable-next-line:max-line-length
  haiku.plumbing.url = `http://${global.process.env.HAIKU_PLUMBING_HOST || '0.0.0.0'}:${global.process.env.HAIKU_PLUMBING_PORT}/?token=${process.env.HAIKU_WS_SECURITY_TOKEN}`;
}

function createWindow () {
  logger.view = 'main';
  mixpanel.haikuTrack('app:initialize');

  browserWindow = new BrowserWindow({
    title: 'Haiku Animator',
    show: false, // Don't show the window until we are ready-to-show (see below)
    titleBarStyle: 'hiddenInset',
    minWidth: 700,
    minHeight: 650,
    backgroundColor: '#343f41',
  });

  const topmenu = new TopMenu(browserWindow.webContents);

  const topmenuOptions = {
    projectsList: [],
    isSaving: false,
    isProjectOpen: false,
    subComponents: [],
    undoState: {canUndo: false, canRedo: false},
  };

  topmenu.create(topmenuOptions);

  ipcMain.on('topmenu:update', (_, nextTopmenuOptions) => {
    topmenu.update(nextTopmenuOptions);
  });

  ipcMain.on('restart', () => {
    app.relaunch();
    browserWindow.close();
  });

  // Emitted by Creator during project bootstrapping, this ensures image URLs like web+haikuroot://assets/designs/…
  // display correctly in thumbnails.
  ipcMain.on('protocol:register', (_, projectPath) => {
    protocol.registerFileProtocol('web+haikuroot', (request, cb) => {
      cb(ensureTrailingSlash(projectPath) + request.url.substr(16));
    });
  });

  // We also need to be able to tear down the protocol when a project is shut down.
  ipcMain.on('protocol:unregister', () => {
    protocol.unregisterProtocol('web+haikuroot');
  });

  browserWindow.setTitle('Haiku Animator');
  browserWindow.maximize();
  browserWindow.loadURL(appUrl);

  if (process.env.DEV === '1' || process.env.DEV === 'creator') {
    browserWindow.openDevTools();

    const {default: installExtension, REACT_DEVELOPER_TOOLS} = require('electron-devtools-installer');
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
  }

  // Sending our haiku configuration into the view so it can correctly set up
  // its own websocket connections to our plumbing server, etc.
  browserWindow.webContents.on('did-finish-load', () => {
    const ses = session.fromPartition('persist:name');
    https.globalAgent = http.globalAgent = new ElectronProxyAgent(session.defaultSession);

    ses.resolveProxy(haiku.plumbing.url, (proxy) => {
      haiku.proxy = {
        // Proxy URL will come through in PAC syntax, e.g. `PROXY secure.megacorp.com:3128`
        // @see {@link https://en.wikipedia.org/wiki/Proxy_auto-config}
        url: proxy.replace(`${ProxyType.Proxied} `, ''),
        active: isProxied(proxy),
      };

      browserWindow.webContents.send('haiku', haiku);
      if (global.process.env.HAIKU_INITIAL_URL) {
        handleUrl(global.process.env.HAIKU_INITIAL_URL);
        delete global.process.env.HAIKU_INITIAL_URL;
      }
    });
  });

  browserWindow.on('closed', () => {
    browserWindow = null;
  });

  browserWindow.on('ready-to-show', () => {
    browserWindow.show();
  });
}

// Transmit haiku://foo/bar?baz=bat as the "open-url:foo" event with arguments [_, "/bar", {"baz": "bat"}]
app.on('open-url', (event, url) => {
  event.preventDefault();
  handleUrl(url);
});

if (app.isReady()) {
  createWindow();
} else {
  app.on('ready', createWindow);
}

// Hacky: When plumbing launches inside an Electron process it expects an EventEmitter-like
// object as the export, so we expose this here even though it doesn't do much
module.exports = {
  default: creator,
};
