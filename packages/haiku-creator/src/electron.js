import EventEmitter from 'events'
import http from 'http'
import https from 'https'
import os from 'os'
import path from 'path'
import { parse } from 'url'
import { inherits } from 'util'

import { BrowserWindow, app, ipcMain, systemPreferences, session, globalShortcut } from 'electron'
import ElectronProxyAgent from 'electron-proxy-agent'
import qs from 'qs'

import { isProxied, ProxyType } from 'haiku-common/lib/proxies'
import mixpanel from 'haiku-serialization/src/utils/Mixpanel'
import logger from 'haiku-serialization/src/utils/LoggerInstance'

import TopMenu from './TopMenu'

if (!app) {
  throw new Error('You can only run electron.js from an electron process')
}

app.setName('Haiku')
app.setAsDefaultProtocolClient('haiku')

// Disable "Start Dictation" and "Emoji & Symbols" menu items on MAC
if (os.platform() === 'darwin') {
  systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true)
  systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true)
}

app.on('login', (event, webContents, request, authInfo, authenticate) => {
  // We are currently not equipped to authenticate requests that are intercepted by a proxy but require login
  // credentials when we encounter interference at this stage. When this functionality is added:
  //   - `event.preventDefault()` will prevent the default behavior of Electron blocking the request.
  //   - Invoking the callback like `authenticate(username, password)` should allow the authenticated-proxied request
  //     through.
  // For now, log the authorization info so we can at least see what's going on.
  logger.warn('[unexpected proxy interference]', authInfo)
})

// See bottom
function CreatorElectron () {
  EventEmitter.apply(this)
}
inherits(CreatorElectron, EventEmitter)
const creator = new CreatorElectron()

const appUrl = 'file://' + path.join(__dirname, '..', 'index.html')

// Plumbing starts up this process, and it uses HAIKU_ENV to forward to us data about
// how it has been set up, e.g. what ports it is using for websocket server, envoy, etc.
// This is sent into the DOM part of the app at did-finish load; see below.
const haiku = global.process.env.HAIKU_ENV
  ? JSON.parse(global.process.env.HAIKU_ENV)
  : {}

if (!haiku.folder) {
  haiku.folder = global.process.env.HAIKU_PROJECT_FOLDER
}

let browserWindow = null

app.on('window-all-closed', () => {
  app.quit()
})

if (!haiku.plumbing) haiku.plumbing = {}

if (!haiku.plumbing.url) {
  if (global.process.env.NODE_ENV !== 'test' && !global.process.env.HAIKU_PLUMBING_PORT) {
    throw new Error(`Oops! You must define a HAIKU_PLUMBING_PORT env var!`)
  }

  haiku.plumbing.url = `http://${global.process.env.HAIKU_PLUMBING_HOST || '0.0.0.0'}:${global.process.env.HAIKU_PLUMBING_PORT}/?token=${process.env.HAIKU_WS_SECURITY_TOKEN}`
}

const handleUrl = (url) => {
  if (!browserWindow) {
    logger.warn(`[creator] unable to handle custom protocol URL ${url}; browserWindow not ready`)
    return
  }
  logger.info(`[creator] handling custom protocol URL ${url}`)
  const parsedUrl = parse(url)
  browserWindow.webContents.send(`open-url:${parsedUrl.host}`, parsedUrl.pathname, qs.parse(parsedUrl.query))
}

function different (a, b) {
  return a !== b
}

function createWindow () {
  mixpanel.haikuTrack('app:initialize')

  const topmenu = new TopMenu()

  const menuspec = {
    undoables: [],
    redoables: [],
    projectList: [],
    isSaving: false,
    folder: null
  }

  topmenu.create(menuspec)

  ipcMain.on('master:heartbeat', (ipcEvent, masterState) => {
    // Update the global menu, but only if the data feeding it appears to have changed.
    // This is driven by a frequent heartbeat hence the reason we are checking for changes
    // before actually re-rendering the whole thing
    let didChange = false

    // The reason for all these guards is that it appears that the heartbeat either
    // (a) continues to tick despite master crashing
    // (b) returns bad data, missing some fields, when master is in a bad state
    // So we check that the things exist before repopulating
    if (masterState) {
      if (masterState.undoables) {
        if (different(menuspec.undoables.length, masterState.undoables.length)) {
          didChange = true
          menuspec.undoables = masterState.undoables || []
        }
      }

      if (masterState.redoables) {
        if (different(menuspec.redoables.length, masterState.redoables.length)) {
          didChange = true
          menuspec.redoables = masterState.redoables || []
        }
      }

      if (different(menuspec.folder, masterState.folder)) {
        didChange = true
        menuspec.folder = masterState.folder
      }

      if (different(menuspec.isSaving, masterState.isSaving)) {
        didChange = true
        menuspec.isSaving = masterState.isSaving
      }
    }

    if (didChange) {
      topmenu.create(menuspec)
    }
  })

  ipcMain.on('renderer:projects-list-fetched', (ipcEvent, projectList) => {
    menuspec.projectList = projectList
    menuspec.folder = null
    topmenu.create(menuspec)
  })

  browserWindow = new BrowserWindow({
    title: 'Haiku',
    show: false, // Don't show the window until we are ready-to-show (see below)
    titleBarStyle: 'hidden-inset'
  })

  browserWindow.setTitle('Haiku')
  browserWindow.maximize()
  browserWindow.loadURL(appUrl)

  if (process.env.DEV === '1') {
    browserWindow.openDevTools()
  }

  // Sending our haiku configuration into the view so it can correctly set up
  // its own websocket connections to our plumbing server, etc.
  browserWindow.webContents.on('did-finish-load', () => {
    const ses = session.fromPartition('persist:name')
    https.globalAgent = http.globalAgent = new ElectronProxyAgent(session.defaultSession)

    ses.resolveProxy(haiku.plumbing.url, (proxy) => {
      haiku.proxy = {
        // Proxy URL will come through in PAC syntax, e.g. `PROXY secure.megacorp.com:3128`
        // @see {@link https://en.wikipedia.org/wiki/Proxy_auto-config}
        url: proxy.replace(`${ProxyType.Proxied} `, ''),
        active: isProxied(proxy)
      }

      browserWindow.webContents.send('haiku', haiku)
      if (global.process.env.HAIKU_INITIAL_URL) {
        handleUrl(global.process.env.HAIKU_INITIAL_URL)
      }
    })
  })

  // Events to delegate to BrowserWindow event handlers.
  const globalMenuPassthroughs = [
    'check-updates',
    'copy',
    'cut',
    'export',
    'group',
    'open-terminal',
    'open-text-editor',
    'paste',
    'redo',
    'save',
    'selectall',
    'show-changelog',
    'show-project-location-toast',
    'start-tour',
    'undo',
    'ungroup',
    'zoom-in',
    'zoom-out'
  ]

  globalMenuPassthroughs.forEach((command) => {
    topmenu.on(`global-menu:${command}`, (...args) => {
      console.info(`global-menu:${command}`, args)
      browserWindow.webContents.send(`global-menu:${command}`, ...args)
    })
  })

  browserWindow.on('closed', () => { browserWindow = null })

  browserWindow.on('ready-to-show', () => {
    browserWindow.show()
  })
}

// Transmit haiku://foo/bar?baz=bat as the "open-url:foo" event with arguments [_, "/bar", {"baz": "bat"}]
app.on('open-url', (event, url) => {
  event.preventDefault()
  handleUrl(url)
})

if (app.isReady()) {
  createWindow()
} else {
  app.on('ready', createWindow)
}

// Hacky: When plumbing launches inside an Electron process it expects an EventEmitter-like
// object as the export, so we expose this here even though it doesn't do much
module.exports = {
  default: creator
}
