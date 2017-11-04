const qs = require('qs')
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')

/**
 * This file is bypassed when loaded in the full app.
 * This is only used as a harness for developin on glass standalone.
 */

let url = `file://${path.join(__dirname, '..', 'index.html')}`

const params = {
  email: 'matthew+SENTRY-TESTING-USER@haiku.ai',
  folder: process.env.HAIKU_PROJECT_FOLDER,
  plumbing: process.env.HAIKU_PLUMBING_URL
}

if (process.env.MOCK_ENVOY === '1') {
  params.envoy = { mock: true }
}

console.info('[glass] launching window with params', params)

const query = qs.stringify(params)

url = `${url}?${query}`

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({ width: 1200, height: 800 })
  mainWindow.loadURL(url)

  if (process.env.DEV === '1') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
