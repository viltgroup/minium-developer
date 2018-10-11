var _child_process = require('child_process'),
    _fs = require('fs'),
    _http = require('http'),
    _os = require('os'),
    _path = require('path'),
    _yaml = require('js-yaml');

var conf,
    process,
    rootDir = _path.join(__dirname, '../..');

function callbackWhenMiniumDeveloperHasLoaded(callback) {
  isMiniumDeveloperRunning((running) => {
    running ? callback() : setTimeout(() => { callbackWhenMiniumDeveloperHasLoaded(callback) }, 1000)
  })
}

function executeScript(path, args, options) {
  if (isWindows()) {
    return _child_process.spawn('cmd', ['/c', _path.join(rootDir, path)].concat(args), options);
  } else {
    return _child_process.spawn('sh', [_path.join(rootDir, path)].concat(args), options);
  }
}

function getUrl() {
  return 'http://localhost:' + conf.server.port;
}

function isMiniumDeveloperRunning(callback) {
  _http.get(getUrl(), (response) => {
    callback(true);
  }).on('error', (e) => {
    callback(false);
  });
}

function isWindows() {
  return _os.platform() === "win32";
}

module.exports = {
  automate: (args) => {
    if (isWindows()) {
      executeScript('bin/minium-automator.bat', args, {
        detached: true,
        stdio: 'ignore'
      }).unref();
    } else {
      executeScript('bin/minium-automator', args, {
        stdio: 'inherit'
      });
    }
  },
  getUrl: getUrl,
  notifyMeWhenReady: callbackWhenMiniumDeveloperHasLoaded,
  start: new Promise(function(resolve, reject) {
    conf = _yaml.safeLoad(_fs.readFileSync(_path.join(rootDir, 'config/application.yml'), 'utf8'));

    isMiniumDeveloperRunning((running) => {
      if (!running) {
        process = isWindows() ?
          executeScript('bin/minium-developer.bat', [], { cwd: rootDir })
          :	executeScript('bin/minium-developer', [], { cwd: rootDir });
        resolve();
      } else {
        reject("Minium Developer is already running or another application is using the port " + conf.server.port + " (you can change the port in the config/application.yml file).");
      }
    });
  }),
  startInBrowser: () => {
    if (isWindows()) {
      executeScript('bin/minium-developer.bat', ['--browser'], {
        detached: true,
        cwd: rootDir,
        stdio: 'ignore'
      }).unref();
    } else {
      executeScript('bin/minium-developer', ['--browser'], {
        cwd: rootDir,
        stdio: 'inherit'
      });
    }
  },
  shutdown: () => {
    if (process) {
      if (isWindows()) {
        _child_process.spawnSync("taskkill", ["/pid", process.pid, '/f', '/t']);
      } else {
        process.kill();
      }
    }
  }
};
