var _child_process = require('child_process'),
  _http = require('http'),
  _os = require('os'),
  _path = require('path');

var electron, miniumDeveloperProcess, window;

var close = (() => {
  var thereAreUnsavedFiles;

  return (event) => {
    if (thereAreUnsavedFiles === undefined || thereAreUnsavedFiles) {
      event.preventDefault();
    }

    if (thereAreUnsavedFiles === undefined) {
      window.webContents.executeJavaScript(`angular.element(document.body).injector().get('MiniumEditor').areDirty()`, false, (result) => { thereAreUnsavedFiles = result; });
    }

    function showDialogIfThereAreUnsavedFiles() {
      if (thereAreUnsavedFiles === undefined) {
          setTimeout(showDialogIfThereAreUnsavedFiles, 100);
      } else {
        if (thereAreUnsavedFiles) {
          electron.dialog.showMessageBox(window, {
              type: 'warning',
              buttons: ['Yes', 'Cancel'],
              title: 'There are unsaved files',
              message: 'There are unsaved files, are you sure that you want to close Minium Developer?'
          }, (response) => {
            if (response == 0) {
              shutdown();
            } else {
              thereAreUnsavedFiles = undefined;
            }
          });
        } else {
          shutdown();
        }
      }
    }

    showDialogIfThereAreUnsavedFiles();
  }
})();

function isMiniumDeveloperRunning(callback) {
  _http.get('http://localhost:8089', (response) => {
    callback(true);
  }).on('error', (e) => {
    callback(false);
  });
}

function isWindows() {
  return _os.platform() === "win32";
}

function openMiniumDeveloperWhenReady() {
  isMiniumDeveloperRunning((isRunning) => {
    isRunning ? window.loadURL('http://localhost:8089') : setTimeout(openMiniumDeveloperWhenReady, 2500);
  });
}

function shutdown() {
  if (miniumDeveloperProcess) {
    if (isWindows()) {
      _child_process.spawnSync("taskkill", ["/pid", miniumDeveloperProcess.pid, '/f', '/t']);
    } else {
      miniumDeveloperProcess.kill();
    }
  }

  window.removeListener('close', close);
  electron.app.quit();
}

module.exports = {
  launch: (_electron, _window) => {
    electron = _electron;
    window = _window;

    window.loadURL('file://' + _path.join(__dirname, 'static/loading.html'));
    window.on('close', close);

    isMiniumDeveloperRunning((isRunning) => {
      if (!isRunning) {
        miniumDeveloperProcess = isWindows() ?
          _child_process.spawn('cmd', ['/c', _path.join(__dirname, '../../../minium-tools/bin/minium-developer.bat')])
          :	_child_process.spawn('sh', [_path.join(__dirname, '../../../minium-tools/bin/minium-developer')]);
      } else {
        shutdown();
      }
    });

    openMiniumDeveloperWhenReady();
  }
};
