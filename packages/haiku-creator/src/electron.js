import { BrowserWindow, app, ipcMain, systemPreferences, session } from 'electron'
import EventEmitter from 'events'
import path from 'path'
import { inherits } from 'util'
import mixpanel from 'haiku-serialization/src/utils/Mixpanel'
import TopMenu from './TopMenu'
import { isProxied } from 'haiku-common/lib/proxies'

if (!app) {
  throw new Error('You can only run electron.js from an electron process')
}

app.setName('Haiku')

systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true)
systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true)

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

  haiku.plumbing.url = `http://${global.process.env.HAIKU_PLUMBING_HOST || 'loopback.haiku.ai'}:${global.process.env.HAIKU_PLUMBING_PORT}/?token=${process.env.HAIKU_WS_SECURITY_TOKEN}`
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

    ses.resolveProxy(haiku.plumbing.url, (proxy) => {
      haiku.proxy = {
        url: proxy,
        active: isProxied(proxy)
      }

      browserWindow.webContents.send('haiku', haiku)
    })
  })

  // TopMenu global-menu:-prefixed events should delegate to BrowserWindow for event handlers.
  const globalMenuPassthroughs = [
    'check-updates',
    'export',
    'open-terminal',
    'open-text-editor',
    'redo',
    'save',
    'show-project-location-toast',
    'start-tour',
    'undo',
    'zoom-in',
    'zoom-out'
  ]

  globalMenuPassthroughs.forEach((command) => {
    topmenu.on(`global-menu:${command}`, (...args) => {
      browserWindow.webContents.send(`global-menu:${command}`, ...args)
    })
  })

  browserWindow.on('closed', () => { browserWindow = null })

  browserWindow.on('ready-to-show', () => {
    browserWindow.show()
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
