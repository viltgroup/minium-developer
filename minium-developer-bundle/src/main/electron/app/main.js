const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

const miniumDeveloper = require('./minium-developer.js')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

app.on('ready', () => {
  if (process.argv.includes("automate")) {
    miniumDeveloper.automate(process.argv.slice(process.argv.indexOf("automate") + 1))
    app.quit()
  } else if (process.argv.includes("--browser")) {
    miniumDeveloper.startInBrowser()
    app.quit()
  } else {
    mainWindow = new BrowserWindow({icon: path.join(__dirname, 'static/icon.png'), webPreferences: { nodeIntegration: false }})
    mainWindow.hide()
    mainWindow.title = 'Minium Developer'
    mainWindow.loadURL('file://' + path.join(__dirname, 'static/loading.html'))
    mainWindow.maximize()
    mainWindow.show()
    mainWindow.on('closed', function () {
      miniumDeveloper.shutdown()
      mainWindow = null
    })
    miniumDeveloper.start.then(() => {
      miniumDeveloper.notifyMeWhenReady(() => {
        mainWindow.loadURL(miniumDeveloper.getUrl());
        mainWindow.on('close', closeHandler);
      })
    }, (errorMessage) => {
      electron.dialog.showErrorBox("Error", errorMessage);
      closeApp()
    });

    if (process.platform == 'darwin') {
      var template = [{
          label: "Minium Developer",
          submenu: [
              { label: "Quit", accelerator: "Command+Q", role: 'quit' }
          ]}, {
          label: "Edit",
          submenu: [
              { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
              { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
              { type: "separator" },
              { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
              { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
              { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
              { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
          ]}
      ];

      Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    }
  }
})

function closeApp() {
  mainWindow.removeAllListeners('close');
  app.quit();
}

var closeHandler = (() => {
  var thereAreUnsavedFiles;

  return (event) => {
    if (thereAreUnsavedFiles === undefined || thereAreUnsavedFiles) {
      event.preventDefault();
    }

    if (thereAreUnsavedFiles === undefined) {
      mainWindow.webContents.executeJavaScript(`angular.element(document.body).injector().get('MiniumEditor').areDirty()`, false, (result) => { thereAreUnsavedFiles = result; });
    }

    function showDialogIfThereAreUnsavedFiles() {
      if (thereAreUnsavedFiles === undefined) {
          setTimeout(showDialogIfThereAreUnsavedFiles, 100);
      } else {
        if (thereAreUnsavedFiles) {
          electron.dialog.showMessageBox(mainWindow, {
              type: 'warning',
              buttons: ['Yes', 'Cancel'],
              title: 'There are unsaved files',
              message: 'There are unsaved files, are you sure that you want to close Minium Developer?'
          }, (response) => {
            if (response == 0) {
              closeApp();
            } else {
              thereAreUnsavedFiles = undefined;
            }
          });
        } else {
          closeApp();
        }
      }
    }

    showDialogIfThereAreUnsavedFiles();
  }
})();

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
