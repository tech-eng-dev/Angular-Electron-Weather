const {app, BrowserWindow, ipcMain} = require('electron')
const url = require('url');
const path = require('path');

/** ipcMain::ipcRenderer communication for Sqlite Database */
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/database.sqlite'
});
const queryInterface = sequelize.getQueryInterface();
queryInterface.createTable('settings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: DataTypes.STRING,
    defaultValue: false,
    allowNull: true
  },
  host: {
    type: DataTypes.STRING,
    defaultValue: false,
    allowNull: true
  },
  key: {
    type: DataTypes.STRING,
    defaultValue: false,
    allowNull: true
  }
});

ipcMain.on('add-settings', async (event, arg) => {
  queryInterface.bulkInsert('settings', [{
    url: arg?.url,
    host: arg?.host,
    key: arg?.key
  }]).then(result => {
    event.returnValue = result;
  });
});

ipcMain.on('get-settings', async (event, arg) => {
  return queryInterface.sequelize.query(
    `SELECT * FROM "settings" WHERE 1`, {
      type: queryInterface.sequelize.QueryTypes.SELECT
    }).then(settings => {
      event.returnValue = settings;
    });
});
/** --- */

let mainWindow;
require('@electron/remote/main').initialize();
var args = process.argv.slice(1), serve = args.some(function (val) { return val === '--serve'; });
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      allowRunningInsecureContent: (serve) ? true : false,
      nativeWindowOpen: true,
      enableRemoteModule: true // true if you want to run e2e test with Spectron or use remote module in renderer context (ie. Angular)
    }
  });

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

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) createWindow()
});
