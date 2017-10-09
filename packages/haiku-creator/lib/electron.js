'use strict';

var path = require('path');
var electron = require('electron');
var ipcMain = electron.ipcMain;
var systemPreferences = electron.systemPreferences;
var app = electron.app;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

if (!app) {
  throw new Error('You can only run electron.js from an electron process');
}

var TopMenu = require('./TopMenu');

systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true);
systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true);

app.setName('Haiku');

// See bottom
function CreatorElectron() {
  EventEmitter.apply(this);
}
util.inherits(CreatorElectron, EventEmitter);
var creator = new CreatorElectron();

var BrowserWindow = electron.BrowserWindow;
var mixpanel = require('haiku-serialization/src/utils/Mixpanel');

var URL = 'file://' + path.join(__dirname, '..', 'index.html');

// Plumbing starts up this process, and it uses HAIKU_ENV to forward to us data about
// how it has been set up, e.g. what ports it is using for websocket server, envoy, etc.
// This is sent into the DOM part of the app at did-finish load; see below.
var haiku = JSON.parse(process.env.HAIKU_ENV || '{}');

if (!haiku.folder) haiku.folder = process.env.HAIKU_PROJECT_FOLDER;

var browserWindow = null;

app.on('window-all-closed', function () {
  app.quit();
});

if (!haiku.plumbing) haiku.plumbing = {};

if (!haiku.plumbing.url) {
  if (process.env.NODE_ENV !== 'test' && !process.env.HAIKU_PLUMBING_PORT) {
    throw new Error('Oops! You must define a HAIKU_PLUMBING_PORT env var!');
  }

  haiku.plumbing.url = 'http://' + (process.env.HAIKU_PLUMBING_HOST || '0.0.0.0') + ':' + process.env.HAIKU_PLUMBING_PORT + '/';
}

function different(a, b) {
  return a !== b;
}

function createWindow() {
  mixpanel.haikuTrack('app:initialize');

  var topmenu = new TopMenu();

  var menuspec = {
    undoables: [],
    redoables: [],
    projectList: [],
    isSaving: false,
    folder: null
  };

  topmenu.create(menuspec);

  ipcMain.on('master:heartbeat', function (ipcEvent, masterState) {
    // Update the global menu, but only if the data feeding it appears to have changed.
    // This is driven by a frequent heartbeat hence the reason we are checking for changes
    // before actually re-rendering the whole thing
    var didChange = false;

    // The reason for all these guards is that it appears that the heartbeat either
    // (a) continues to tick despite master crashing
    // (b) returns bad data, missing some fields, when master is in a bad state
    // So we check that the things exist before repopulating
    if (masterState) {
      if (masterState.gitUndoables) {
        if (different(menuspec.undoables.length, masterState.gitUndoables.length)) {
          didChange = true;
          menuspec.undoables = masterState.gitUndoables || [];
        }
      }

      if (masterState.gitRedoables) {
        if (different(menuspec.redoables.length, masterState.gitRedoables.length)) {
          didChange = true;
          menuspec.redoables = masterState.gitRedoables || [];
        }
      }

      if (different(menuspec.folder, masterState.folder)) {
        didChange = true;
        menuspec.folder = masterState.folder;
      }

      if (different(menuspec.isSaving, masterState.isSaving)) {
        didChange = true;
        menuspec.isSaving = masterState.isSaving;
      }
    }

    if (didChange) {
      topmenu.create(menuspec);
    }
  });

  ipcMain.on('renderer:projects-list-fetched', function (ipcEvent, projectList) {
    menuspec.projectList = projectList;
    topmenu.create(menuspec);
  });

  browserWindow = new BrowserWindow({
    title: 'Haiku',
    show: false, // Don't show the window until we are ready-to-show (see below)
    titleBarStyle: 'hidden-inset',
    webPreferences: {
      webSecurity: false
    }
  });

  browserWindow.setTitle('Haiku');
  browserWindow.maximize();
  browserWindow.loadURL(URL);

  // Sending our haiku configuration into the view so it can correctly set up
  // its own websocket connections to our plumbing server, etc.
  browserWindow.webContents.on('did-finish-load', function () {
    browserWindow.webContents.send('haiku', haiku);
  });

  topmenu.on('global-menu:save', function () {
    browserWindow.webContents.send('global-menu:save');
  });

  topmenu.on('global-menu:undo', function () {
    browserWindow.webContents.send('global-menu:undo');
  });
  topmenu.on('global-menu:redo', function () {
    browserWindow.webContents.send('global-menu:redo');
  });

  topmenu.on('global-menu:zoom-in', function () {
    browserWindow.webContents.send('global-menu:zoom-in');
  });
  topmenu.on('global-menu:zoom-out', function () {
    browserWindow.webContents.send('global-menu:zoom-out');
  });

  topmenu.on('global-menu:open-text-editor', function () {
    browserWindow.webContents.send('global-menu:open-text-editor');
  });
  topmenu.on('global-menu:open-terminal', function () {
    browserWindow.webContents.send('global-menu:open-terminal');
  });
  topmenu.on('global-menu:toggle-dev-tools', function () {
    browserWindow.webContents.send('global-menu:toggle-dev-tools');
  });

  topmenu.on('global-menu:start-tour', function () {
    browserWindow.webContents.send('global-menu:start-tour');
  });

  topmenu.on('global-menu:check-updates', function () {
    browserWindow.webContents.send('global-menu:check-updates');
  });

  // active in dev & staging only
  topmenu.on('global-menu:open-hacker-helper', function () {
    browserWindow.webContents.send('global-menu:open-hacker-helper');
  });
  topmenu.on('global-menu:dump-system-info', function () {
    browserWindow.webContents.send('global-menu:dump-system-info');
  });
  topmenu.on('global-menu:set-tool', function (tool) {
    browserWindow.webContents.send('global-menu:set-tool', tool);
  });

  browserWindow.on('closed', function () {
    browserWindow = null;
  });

  browserWindow.on('ready-to-show', function () {
    browserWindow.show();
  });

  // Uncomment me to automatically open the tools
  // browserWindow.openDevTools()
}

if (app.isReady()) {
  createWindow();
} else {
  app.on('ready', createWindow);
}

// Hacky: When plumbing launches inside an Electron process it expects an EventEmitter-like
// object as the export, so we expose this here even though it doesn't do much
module.exports = {
  default: creator
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lbGVjdHJvbi5qcyJdLCJuYW1lcyI6WyJwYXRoIiwicmVxdWlyZSIsImVsZWN0cm9uIiwiaXBjTWFpbiIsInN5c3RlbVByZWZlcmVuY2VzIiwiYXBwIiwiRXZlbnRFbWl0dGVyIiwidXRpbCIsIkVycm9yIiwiVG9wTWVudSIsInNldFVzZXJEZWZhdWx0Iiwic2V0TmFtZSIsIkNyZWF0b3JFbGVjdHJvbiIsImFwcGx5IiwiaW5oZXJpdHMiLCJjcmVhdG9yIiwiQnJvd3NlcldpbmRvdyIsIm1peHBhbmVsIiwiVVJMIiwiam9pbiIsIl9fZGlybmFtZSIsImhhaWt1IiwiSlNPTiIsInBhcnNlIiwicHJvY2VzcyIsImVudiIsIkhBSUtVX0VOViIsImZvbGRlciIsIkhBSUtVX1BST0pFQ1RfRk9MREVSIiwiYnJvd3NlcldpbmRvdyIsIm9uIiwicXVpdCIsInBsdW1iaW5nIiwidXJsIiwiTk9ERV9FTlYiLCJIQUlLVV9QTFVNQklOR19QT1JUIiwiSEFJS1VfUExVTUJJTkdfSE9TVCIsImRpZmZlcmVudCIsImEiLCJiIiwiY3JlYXRlV2luZG93IiwiaGFpa3VUcmFjayIsInRvcG1lbnUiLCJtZW51c3BlYyIsInVuZG9hYmxlcyIsInJlZG9hYmxlcyIsInByb2plY3RMaXN0IiwiaXNTYXZpbmciLCJjcmVhdGUiLCJpcGNFdmVudCIsIm1hc3RlclN0YXRlIiwiZGlkQ2hhbmdlIiwiZ2l0VW5kb2FibGVzIiwibGVuZ3RoIiwiZ2l0UmVkb2FibGVzIiwidGl0bGUiLCJzaG93IiwidGl0bGVCYXJTdHlsZSIsIndlYlByZWZlcmVuY2VzIiwid2ViU2VjdXJpdHkiLCJzZXRUaXRsZSIsIm1heGltaXplIiwibG9hZFVSTCIsIndlYkNvbnRlbnRzIiwic2VuZCIsInRvb2wiLCJpc1JlYWR5IiwibW9kdWxlIiwiZXhwb3J0cyIsImRlZmF1bHQiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsT0FBT0MsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJQyxXQUFXRCxRQUFR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QUVEO0FBQ0E7QUFDQTJCLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsV0FBU3REO0FBRE0sQ0FBakIiLCJmaWxlIjoiZWxlY3Ryb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxudmFyIGlwY01haW4gPSBlbGVjdHJvbi5pcGNNYWluXG52YXIgc3lzdGVtUHJlZmVyZW5jZXMgPSBlbGVjdHJvbi5zeXN0ZW1QcmVmZXJlbmNlc1xudmFyIGFwcCA9IGVsZWN0cm9uLmFwcFxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlclxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJylcblxuaWYgKCFhcHApIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY2FuIG9ubHkgcnVuIGVsZWN0cm9uLmpzIGZyb20gYW4gZWxlY3Ryb24gcHJvY2VzcycpXG59XG5cbnZhciBUb3BNZW51ID0gcmVxdWlyZSgnLi9Ub3BNZW51Jylcblxuc3lzdGVtUHJlZmVyZW5jZXMuc2V0VXNlckRlZmF1bHQoJ05TRGlzYWJsZWREaWN0YXRpb25NZW51SXRlbScsICdib29sZWFuJywgdHJ1ZSlcbnN5c3RlbVByZWZlcmVuY2VzLnNldFVzZXJEZWZhdWx0KCdOU0Rpc2FibGVkQ2hhcmFjdGVyUGFsZXR0ZU1lbnVJdGVtJywgJ2Jvb2xlYW4nLCB0cnVlKVxuXG5hcHAuc2V0TmFtZSgnSGFpa3UnKVxuXG4vLyBTZWUgYm90dG9tXG5mdW5jdGlvbiBDcmVhdG9yRWxlY3Ryb24gKCkge1xuICBFdmVudEVtaXR0ZXIuYXBwbHkodGhpcylcbn1cbnV0aWwuaW5oZXJpdHMoQ3JlYXRvckVsZWN0cm9uLCBFdmVudEVtaXR0ZXIpXG52YXIgY3JlYXRvciA9IG5ldyBDcmVhdG9yRWxlY3Ryb24oKVxuXG52YXIgQnJvd3NlcldpbmRvdyA9IGVsZWN0cm9uLkJyb3dzZXJXaW5kb3dcbnZhciBtaXhwYW5lbCA9IHJlcXVpcmUoJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL01peHBhbmVsJylcblxudmFyIFVSTCA9ICdmaWxlOi8vJyArIHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdpbmRleC5odG1sJylcblxuLy8gUGx1bWJpbmcgc3RhcnRzIHVwIHRoaXMgcHJvY2VzcywgYW5kIGl0IHVzZXMgSEFJS1VfRU5WIHRvIGZvcndhcmQgdG8gdXMgZGF0YSBhYm91dFxuLy8gaG93IGl0IGhhcyBiZWVuIHNldCB1cCwgZS5nLiB3aGF0IHBvcnRzIGl0IGlzIHVzaW5nIGZvciB3ZWJzb2NrZXQgc2VydmVyLCBlbnZveSwgZXRjLlxuLy8gVGhpcyBpcyBzZW50IGludG8gdGhlIERPTSBwYXJ0IG9mIHRoZSBhcHAgYXQgZGlkLWZpbmlzaCBsb2FkOyBzZWUgYmVsb3cuXG52YXIgaGFpa3UgPSBKU09OLnBhcnNlKHByb2Nlc3MuZW52LkhBSUtVX0VOViB8fCAne30nKVxuXG5pZiAoIWhhaWt1LmZvbGRlcikgaGFpa3UuZm9sZGVyID0gcHJvY2Vzcy5lbnYuSEFJS1VfUFJPSkVDVF9GT0xERVJcblxubGV0IGJyb3dzZXJXaW5kb3cgPSBudWxsXG5cbmFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCAoKSA9PiB7XG4gIGFwcC5xdWl0KClcbn0pXG5cbmlmICghaGFpa3UucGx1bWJpbmcpIGhhaWt1LnBsdW1iaW5nID0ge31cblxuaWYgKCFoYWlrdS5wbHVtYmluZy51cmwpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAndGVzdCcgJiYgIXByb2Nlc3MuZW52LkhBSUtVX1BMVU1CSU5HX1BPUlQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE9vcHMhIFlvdSBtdXN0IGRlZmluZSBhIEhBSUtVX1BMVU1CSU5HX1BPUlQgZW52IHZhciFgKVxuICB9XG5cbiAgaGFpa3UucGx1bWJpbmcudXJsID0gYGh0dHA6Ly8ke3Byb2Nlc3MuZW52LkhBSUtVX1BMVU1CSU5HX0hPU1QgfHwgJzAuMC4wLjAnfToke3Byb2Nlc3MuZW52LkhBSUtVX1BMVU1CSU5HX1BPUlR9L2Bcbn1cblxuZnVuY3Rpb24gZGlmZmVyZW50IChhLCBiKSB7XG4gIHJldHVybiBhICE9PSBiXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVdpbmRvdyAoKSB7XG4gIG1peHBhbmVsLmhhaWt1VHJhY2soJ2FwcDppbml0aWFsaXplJylcblxuICB2YXIgdG9wbWVudSA9IG5ldyBUb3BNZW51KClcblxuICB2YXIgbWVudXNwZWMgPSB7XG4gICAgdW5kb2FibGVzOiBbXSxcbiAgICByZWRvYWJsZXM6IFtdLFxuICAgIHByb2plY3RMaXN0OiBbXSxcbiAgICBpc1NhdmluZzogZmFsc2UsXG4gICAgZm9sZGVyOiBudWxsXG4gIH1cblxuICB0b3BtZW51LmNyZWF0ZShtZW51c3BlYylcblxuICBpcGNNYWluLm9uKCdtYXN0ZXI6aGVhcnRiZWF0JywgKGlwY0V2ZW50LCBtYXN0ZXJTdGF0ZSkgPT4ge1xuICAgIC8vIFVwZGF0ZSB0aGUgZ2xvYmFsIG1lbnUsIGJ1dCBvbmx5IGlmIHRoZSBkYXRhIGZlZWRpbmcgaXQgYXBwZWFycyB0byBoYXZlIGNoYW5nZWQuXG4gICAgLy8gVGhpcyBpcyBkcml2ZW4gYnkgYSBmcmVxdWVudCBoZWFydGJlYXQgaGVuY2UgdGhlIHJlYXNvbiB3ZSBhcmUgY2hlY2tpbmcgZm9yIGNoYW5nZXNcbiAgICAvLyBiZWZvcmUgYWN0dWFsbHkgcmUtcmVuZGVyaW5nIHRoZSB3aG9sZSB0aGluZ1xuICAgIHZhciBkaWRDaGFuZ2UgPSBmYWxzZVxuXG4gICAgLy8gVGhlIHJlYXNvbiBmb3IgYWxsIHRoZXNlIGd1YXJkcyBpcyB0aGF0IGl0IGFwcGVhcnMgdGhhdCB0aGUgaGVhcnRiZWF0IGVpdGhlclxuICAgIC8vIChhKSBjb250aW51ZXMgdG8gdGljayBkZXNwaXRlIG1hc3RlciBjcmFzaGluZ1xuICAgIC8vIChiKSByZXR1cm5zIGJhZCBkYXRhLCBtaXNzaW5nIHNvbWUgZmllbGRzLCB3aGVuIG1hc3RlciBpcyBpbiBhIGJhZCBzdGF0ZVxuICAgIC8vIFNvIHdlIGNoZWNrIHRoYXQgdGhlIHRoaW5ncyBleGlzdCBiZWZvcmUgcmVwb3B1bGF0aW5nXG4gICAgaWYgKG1hc3RlclN0YXRlKSB7XG4gICAgICBpZiAobWFzdGVyU3RhdGUuZ2l0VW5kb2FibGVzKSB7XG4gICAgICAgIGlmIChkaWZmZXJlbnQobWVudXNwZWMudW5kb2FibGVzLmxlbmd0aCwgbWFzdGVyU3RhdGUuZ2l0VW5kb2FibGVzLmxlbmd0aCkpIHtcbiAgICAgICAgICBkaWRDaGFuZ2UgPSB0cnVlXG4gICAgICAgICAgbWVudXNwZWMudW5kb2FibGVzID0gbWFzdGVyU3RhdGUuZ2l0VW5kb2FibGVzIHx8IFtdXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG1hc3RlclN0YXRlLmdpdFJlZG9hYmxlcykge1xuICAgICAgICBpZiAoZGlmZmVyZW50KG1lbnVzcGVjLnJlZG9hYmxlcy5sZW5ndGgsIG1hc3RlclN0YXRlLmdpdFJlZG9hYmxlcy5sZW5ndGgpKSB7XG4gICAgICAgICAgZGlkQ2hhbmdlID0gdHJ1ZVxuICAgICAgICAgIG1lbnVzcGVjLnJlZG9hYmxlcyA9IG1hc3RlclN0YXRlLmdpdFJlZG9hYmxlcyB8fCBbXVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChkaWZmZXJlbnQobWVudXNwZWMuZm9sZGVyLCBtYXN0ZXJTdGF0ZS5mb2xkZXIpKSB7XG4gICAgICAgIGRpZENoYW5nZSA9IHRydWVcbiAgICAgICAgbWVudXNwZWMuZm9sZGVyID0gbWFzdGVyU3RhdGUuZm9sZGVyXG4gICAgICB9XG5cbiAgICAgIGlmIChkaWZmZXJlbnQobWVudXNwZWMuaXNTYXZpbmcsIG1hc3RlclN0YXRlLmlzU2F2aW5nKSkge1xuICAgICAgICBkaWRDaGFuZ2UgPSB0cnVlXG4gICAgICAgIG1lbnVzcGVjLmlzU2F2aW5nID0gbWFzdGVyU3RhdGUuaXNTYXZpbmdcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGlkQ2hhbmdlKSB7XG4gICAgICB0b3BtZW51LmNyZWF0ZShtZW51c3BlYylcbiAgICB9XG4gIH0pXG5cbiAgaXBjTWFpbi5vbigncmVuZGVyZXI6cHJvamVjdHMtbGlzdC1mZXRjaGVkJywgKGlwY0V2ZW50LCBwcm9qZWN0TGlzdCkgPT4ge1xuICAgIG1lbnVzcGVjLnByb2plY3RMaXN0ID0gcHJvamVjdExpc3RcbiAgICB0b3BtZW51LmNyZWF0ZShtZW51c3BlYylcbiAgfSlcblxuICBicm93c2VyV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgIHRpdGxlOiAnSGFpa3UnLFxuICAgIHNob3c6IGZhbHNlLCAvLyBEb24ndCBzaG93IHRoZSB3aW5kb3cgdW50aWwgd2UgYXJlIHJlYWR5LXRvLXNob3cgKHNlZSBiZWxvdylcbiAgICB0aXRsZUJhclN0eWxlOiAnaGlkZGVuLWluc2V0JyxcbiAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgd2ViU2VjdXJpdHk6IGZhbHNlXG4gICAgfVxuICB9KVxuXG4gIGJyb3dzZXJXaW5kb3cuc2V0VGl0bGUoJ0hhaWt1JylcbiAgYnJvd3NlcldpbmRvdy5tYXhpbWl6ZSgpXG4gIGJyb3dzZXJXaW5kb3cubG9hZFVSTChVUkwpXG5cbiAgLy8gU2VuZGluZyBvdXIgaGFpa3UgY29uZmlndXJhdGlvbiBpbnRvIHRoZSB2aWV3IHNvIGl0IGNhbiBjb3JyZWN0bHkgc2V0IHVwXG4gIC8vIGl0cyBvd24gd2Vic29ja2V0IGNvbm5lY3Rpb25zIHRvIG91ciBwbHVtYmluZyBzZXJ2ZXIsIGV0Yy5cbiAgYnJvd3NlcldpbmRvdy53ZWJDb250ZW50cy5vbignZGlkLWZpbmlzaC1sb2FkJywgKCkgPT4ge1xuICAgIGJyb3dzZXJXaW5kb3cud2ViQ29udGVudHMuc2VuZCgnaGFpa3UnLCBoYWlrdSlcbiAgfSlcblxuICB0b3BtZW51Lm9uKCdnbG9iYWwtbWVudTpzYXZlJywgKCkgPT4ge1xuICAgIGJyb3dzZXJXaW5kb3cud2ViQ29udGVudHMuc2VuZCgnZ2xvYmFsLW1lbnU6c2F2ZScpXG4gIH0pXG5cbiAgdG9wbWVudS5vbignZ2xvYmFsLW1lbnU6dW5kbycsICgpID0+IHtcbiAgICBicm93c2VyV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2dsb2JhbC1tZW51OnVuZG8nKVxuICB9KVxuICB0b3BtZW51Lm9uKCdnbG9iYWwtbWVudTpyZWRvJywgKCkgPT4ge1xuICAgIGJyb3dzZXJXaW5kb3cud2ViQ29udGVudHMuc2VuZCgnZ2xvYmFsLW1lbnU6cmVkbycpXG4gIH0pXG5cbiAgdG9wbWVudS5vbignZ2xvYmFsLW1lbnU6em9vbS1pbicsICgpID0+IHtcbiAgICBicm93c2VyV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2dsb2JhbC1tZW51Onpvb20taW4nKVxuICB9KVxuICB0b3BtZW51Lm9uKCdnbG9iYWwtbWVudTp6b29tLW91dCcsICgpID0+IHtcbiAgICBicm93c2VyV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2dsb2JhbC1tZW51Onpvb20tb3V0JylcbiAgfSlcblxuICB0b3BtZW51Lm9uKCdnbG9iYWwtbWVudTpvcGVuLXRleHQtZWRpdG9yJywgKCkgPT4ge1xuICAgIGJyb3dzZXJXaW5kb3cud2ViQ29udGVudHMuc2VuZCgnZ2xvYmFsLW1lbnU6b3Blbi10ZXh0LWVkaXRvcicpXG4gIH0pXG4gIHRvcG1lbnUub24oJ2dsb2JhbC1tZW51Om9wZW4tdGVybWluYWwnLCAoKSA9PiB7XG4gICAgYnJvd3NlcldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdnbG9iYWwtbWVudTpvcGVuLXRlcm1pbmFsJylcbiAgfSlcbiAgdG9wbWVudS5vbignZ2xvYmFsLW1lbnU6dG9nZ2xlLWRldi10b29scycsICgpID0+IHtcbiAgICBicm93c2VyV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2dsb2JhbC1tZW51OnRvZ2dsZS1kZXYtdG9vbHMnKVxuICB9KVxuXG4gIHRvcG1lbnUub24oJ2dsb2JhbC1tZW51OnN0YXJ0LXRvdXInLCAoKSA9PiB7XG4gICAgYnJvd3NlcldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdnbG9iYWwtbWVudTpzdGFydC10b3VyJylcbiAgfSlcblxuICB0b3BtZW51Lm9uKCdnbG9iYWwtbWVudTpjaGVjay11cGRhdGVzJywgKCkgPT4ge1xuICAgIGJyb3dzZXJXaW5kb3cud2ViQ29udGVudHMuc2VuZCgnZ2xvYmFsLW1lbnU6Y2hlY2stdXBkYXRlcycpXG4gIH0pXG5cbiAgLy8gYWN0aXZlIGluIGRldiAmIHN0YWdpbmcgb25seVxuICB0b3BtZW51Lm9uKCdnbG9iYWwtbWVudTpvcGVuLWhhY2tlci1oZWxwZXInLCAoKSA9PiB7XG4gICAgYnJvd3NlcldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdnbG9iYWwtbWVudTpvcGVuLWhhY2tlci1oZWxwZXInKVxuICB9KVxuICB0b3BtZW51Lm9uKCdnbG9iYWwtbWVudTpkdW1wLXN5c3RlbS1pbmZvJywgKCkgPT4ge1xuICAgIGJyb3dzZXJXaW5kb3cud2ViQ29udGVudHMuc2VuZCgnZ2xvYmFsLW1lbnU6ZHVtcC1zeXN0ZW0taW5mbycpXG4gIH0pXG4gIHRvcG1lbnUub24oJ2dsb2JhbC1tZW51OnNldC10b29sJywgKHRvb2wpID0+IHtcbiAgICBicm93c2VyV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2dsb2JhbC1tZW51OnNldC10b29sJywgdG9vbClcbiAgfSlcblxuICBicm93c2VyV2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiB7IGJyb3dzZXJXaW5kb3cgPSBudWxsIH0pXG5cbiAgYnJvd3NlcldpbmRvdy5vbigncmVhZHktdG8tc2hvdycsICgpID0+IHtcbiAgICBicm93c2VyV2luZG93LnNob3coKVxuICB9KVxuXG4gIC8vIFVuY29tbWVudCBtZSB0byBhdXRvbWF0aWNhbGx5IG9wZW4gdGhlIHRvb2xzXG4gIC8vIGJyb3dzZXJXaW5kb3cub3BlbkRldlRvb2xzKClcbn1cblxuaWYgKGFwcC5pc1JlYWR5KCkpIHtcbiAgY3JlYXRlV2luZG93KClcbn0gZWxzZSB7XG4gIGFwcC5vbigncmVhZHknLCBjcmVhdGVXaW5kb3cpXG59XG5cbi8vIEhhY2t5OiBXaGVuIHBsdW1iaW5nIGxhdW5jaGVzIGluc2lkZSBhbiBFbGVjdHJvbiBwcm9jZXNzIGl0IGV4cGVjdHMgYW4gRXZlbnRFbWl0dGVyLWxpa2Vcbi8vIG9iamVjdCBhcyB0aGUgZXhwb3J0LCBzbyB3ZSBleHBvc2UgdGhpcyBoZXJlIGV2ZW4gdGhvdWdoIGl0IGRvZXNuJ3QgZG8gbXVjaFxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRlZmF1bHQ6IGNyZWF0b3Jcbn1cbiJdfQ==