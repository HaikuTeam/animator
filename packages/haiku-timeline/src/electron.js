import path from 'path'

import qs from 'qs'
import {app, BrowserWindow} from 'electron'

import TopMenu from 'haiku-common/lib/electron/TopMenu'

/**
 * This file is bypassed when loaded in the full app.
 * This is only used as a harness for developin on glass standalone.
 */

if (!app) {
  throw new Error('You can only run electron.js from an electron process')
}

const params = {
  email: 'matthew+SENTRY-TESTING-USER@haiku.ai',
  folder: process.env.HAIKU_PROJECT_FOLDER,
  plumbing: process.env.HAIKU_PLUMBING_URL
}

if (process.env.MOCK_ENVOY) {
  params.envoy = { mock: true }
}

const query = qs.stringify(params)

const url = `file://${path.join(__dirname, '..', 'index.html')}?${query}`

let mainWindow = null

app.on('window-all-closed', () => {
  app.quit()
})

function createWindow () {
  mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false
    }
  })
  mainWindow.maximize()
  mainWindow.loadURL(url)

  if (process.env.DEV === '1') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => { mainWindow = null })

  const topmenu = new TopMenu({
    send: (name) => {
      mainWindow.webContents.send('relay', {name, from: 'electron'})
    }
  })

  topmenu.create({
    projectList: [],
    isSaving: false,
    isProjectOpen: true
  })
}

app.on('ready', createWindow)
