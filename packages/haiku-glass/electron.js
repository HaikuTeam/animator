const qs = require('qs')
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')

let url = `file://${path.join(__dirname, 'index.html')}`

const params = {
  folder: process.env.HAIKU_PROJECT_FOLDER,
  plumbing: process.env.HAIKU_PLUMBING_URL
}

if (process.env.DEV === '1') {
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
