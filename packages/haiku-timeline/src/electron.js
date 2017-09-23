var qs = require('qs')
var path = require('path')
var electron = require('electron')
var app = electron.app
var BrowserWindow = electron.BrowserWindow

if (!app) {
  throw new Error('You can only run electron.js from an electron process')
}

var url = 'file://' + path.join(__dirname, '..', 'index.html')

var params = {
  folder: process.env.HAIKU_PROJECT_FOLDER,
  plumbing: process.env.HAIKU_PLUMBING_URL
}

if (process.env.MOCK_ENVOY === '1') {
  params.envoy = { mock: true }
}

const query = qs.stringify(params)

url = `${url}?${query}`

let browserWindow = null

app.on('window-all-closed', () => {
  app.quit()
})

function createWindow () {
  browserWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false
    }
  })
  browserWindow.maximize()
  browserWindow.loadURL(url)

  if (process.env.DEV === '1') {
    browserWindow.webContents.openDevTools()
  }

  browserWindow.on('closed', () => { browserWindow = null })
}

app.on('ready', createWindow)
