const app = require('app');                       // Controls the application life.
const appRoot = require('app-root-path');         // Fetches the root dir of the app.
const BrowserWindow = require('browser-window');  // Creates the native browser window.
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

const createWindow = function () {
    const screenSize = require('screen').getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        'min-width': 640,
        'min-height': 480,
        height: screenSize.height,
        width: screenSize.width
    });

    mainWindow.loadURL('http://localhost:8080');

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
    createWindow();

    require('./utils/dbUtil.js').setDatastoreFile(path.join(appRoot.path, 'db/hiTerm.json'));
    require('./register.js')();
    require('./registerKeys')();
});