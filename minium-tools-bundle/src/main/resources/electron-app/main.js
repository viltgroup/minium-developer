const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const miniumDeveloper = require('./minium-developer.js')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  if (process.argv.includes("automate")) {
    miniumDeveloper.automate(process.argv.slice(process.argv.indexOf("automate") + 1))
    app.quit()
  } else if (process.argv.includes("--browser")) {
    miniumDeveloper.launchInBrowser()
    app.quit()
  }
  else {
    mainWindow = new BrowserWindow({icon: path.join(__dirname, 'static/icon.png'), webPreferences: { nodeIntegration: false }})
    mainWindow.hide()
    miniumDeveloper.launch(electron, mainWindow)
    mainWindow.maximize()
    mainWindow.show()
    mainWindow.on('closed', function () {
      mainWindow = null
    })
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
