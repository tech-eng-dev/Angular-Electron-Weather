const {app, BrowserWindow} = require('electron')
const url = require("url");
const path = require("path");

let mainWindow
require('@electron/remote/main').initialize();
var args = process.argv.slice(1), serve = args.some(function (val) { return val === '--serve'; });
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      nativeWindowOpen: true,
      enableRemoteModule: true // true if you want to run e2e test with Spectron or use remote module in renderer context (ie. Angular)
    }
  })

  if (serve) {
    mainWindow.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/node_modules/electron'))
    });
    mainWindow.loadURL('http://localhost:4200');
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, `/dist/miniWeather/index.html`),
        protocol: "file:",
        slashes: true
      })
    );
  }
  // mainWindow.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, `/dist/miniWeather/index.html`),
  //     protocol: "file:",
  //     slashes: true
  //   })
  // );
  // // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) createWindow()
});
