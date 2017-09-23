var path = require('path')
var electron = require('electron')
var ipcMain = electron.ipcMain
var systemPreferences = electron.systemPreferences
var app = electron.app
var EventEmitter = require('events').EventEmitter
var util = require('util')

if (!app) {
  throw new Error('You can only run electron.js from an electron process')
}

var TopMenu = require('./TopMenu')

systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true)
systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true)

app.setName('Haiku')

// See bottom
function CreatorElectron () {
  EventEmitter.apply(this)
}
util.inherits(CreatorElectron, EventEmitter)
var creator = new CreatorElectron()

var BrowserWindow = electron.BrowserWindow
var autoUpdate = require('./utils/autoUpdate')
var mixpanel = require('./utils/Mixpanel')
var dialog = require('electron').dialog

var URL = 'file://' + path.join(__dirname, '..', 'index.html')

// Plumbing starts up this process, and it uses HAIKU_ENV to forward to us data about
// how it has been set up, e.g. what ports it is using for websocket server, envoy, etc.
// This is sent into the DOM part of the app at did-finish load; see below.
var haiku = JSON.parse(process.env.HAIKU_ENV || '{}')

if (!haiku.folder) haiku.folder = process.env.HAIKU_PROJECT_FOLDER

let browserWindow = null

app.on('window-all-closed', () => {
  app.quit()
})

if (!haiku.plumbing) haiku.plumbing = {}

if (!haiku.plumbing.url) {
  if (process.env.NODE_ENV !== 'test' && !process.env.HAIKU_PLUMBING_PORT) {
    throw new Error(`Oops! You must define a HAIKU_PLUMBING_PORT env var!`)
  }

  haiku.plumbing.url = `http://${process.env.HAIKU_PLUMBING_HOST || '0.0.0.0'}:${process.env.HAIKU_PLUMBING_PORT}/`
}

function different (a, b) {
  return a !== b
}

function createWindow () {
  mixpanel.haikuTrack('app:initialize')

  var topmenu = new TopMenu()

  var menuspec = {
    undoables: [],
    redoables: [],
    isSaving: false,
    folder: null
  }

  topmenu.create(menuspec)

  ipcMain.on('master:heartbeat', (ipcEvent, masterState) => {
    // Update the global menu, but only if the data feeding it appears to have changed.
    // This is driven by a frequent heartbeat hence the reason we are checking for changes
    // before actually re-rendering the whole thing
    var didChange = false

    // The reason for all these guards is that it appears that the heartbeat either
    // (a) continues to tick despite master crashing
    // (b) returns bad data, missing some fields, when master is in a bad state
    // So we check that the things exist before repopulating
    if (masterState) {
      if (masterState.gitUndoables) {
        if (different(menuspec.undoables.length, masterState.gitUndoables.length)) {
          didChange = true
          menuspec.undoables = masterState.gitUndoables || []
        }
      }

      if (masterState.gitRedoables) {
        if (different(menuspec.redoables.length, masterState.gitRedoables.length)) {
          didChange = true
          menuspec.redoables = masterState.gitRedoables || []
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

  browserWindow = new BrowserWindow({
    title: 'Haiku',
    show: false, // Don't show the window until we are ready-to-show (see below)
    titleBarStyle: 'hidden-inset',
    webPreferences: {
      webSecurity: false
    }
  })

  browserWindow.setTitle('Haiku')
  browserWindow.maximize()
  browserWindow.loadURL(URL)

  // Sending our haiku configuration into the view so it can correctly set up
  // its own websocket connections to our plumbing server, etc.
  browserWindow.webContents.on('did-finish-load', () => {
    browserWindow.webContents.send('haiku', haiku)
  })

  topmenu.on('global-menu:save', () => {
    browserWindow.webContents.send('global-menu:save')
  })

  topmenu.on('global-menu:undo', () => {
    browserWindow.webContents.send('global-menu:undo')
  })
  topmenu.on('global-menu:redo', () => {
    browserWindow.webContents.send('global-menu:redo')
  })

  topmenu.on('global-menu:zoom-in', () => {
    browserWindow.webContents.send('global-menu:zoom-in')
  })
  topmenu.on('global-menu:zoom-out', () => {
    browserWindow.webContents.send('global-menu:zoom-out')
  })

  topmenu.on('global-menu:open-text-editor', () => {
    browserWindow.webContents.send('global-menu:open-text-editor')
  })
  topmenu.on('global-menu:open-terminal', () => {
    browserWindow.webContents.send('global-menu:open-terminal')
  })
  topmenu.on('global-menu:toggle-dev-tools', () => {
    browserWindow.webContents.send('global-menu:toggle-dev-tools')
  })

  topmenu.on('global-menu:start-tour', () => {
    browserWindow.webContents.send('global-menu:start-tour')
  })

  // active in dev & staging only
  topmenu.on('global-menu:open-hacker-helper', () => {
    browserWindow.webContents.send('global-menu:open-hacker-helper')
  })
  topmenu.on('global-menu:dump-system-info', () => {
    browserWindow.webContents.send('global-menu:dump-system-info')
  })
  topmenu.on('global-menu:set-tool', (tool) => {
    browserWindow.webContents.send('global-menu:set-tool', tool)
  })

  browserWindow.on('closed', () => { browserWindow = null })

  browserWindow.on('ready-to-show', () => {
    browserWindow.show()
  })

  autoUpdate((error, message, updater, quitAndInstall) => {
    if (error) console.log(error)
    // You can set a HAIKU_SKIP_AUTOUPDATE env var to skip this entirely
    // If 'quitAndInstall' is present, call it to quit-and-install immediately.
    // Otherwise, the behavior (as far as I can tell) is to download in the background,
    // unzip, and install the next time the app is quitted. I.e.: You need not
    // explicitly do anything for a new update to happen.
    if (message === 'update-downloaded') {
      mixpanel.haikuTrack('app:update-downloaded')
      showAutoUpdateNativeBox(quitAndInstall)
    }
  })
}

function showAutoUpdateNativeBox (quitAndInstallCallback) {
  dialog.showMessageBox({
    message: 'An update is ready to install',
    detail: 'A new version of Haiku is ready to use. Install now to get the latest features and fixes.',
    cancelId: 1,
    defaultId: 0,
    buttons: ['Install Now', 'Install After I Quit']
  }, (responseNum) => {
    if (responseNum === 0) {
      mixpanel.haikuTrack('app:install-later')
      return quitAndInstallCallback()
    } else {
      mixpanel.haikuTrack('app:install-after-i-quit')
    }
  })
}

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
