// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow () {
  // Create the browser window.
    mainWindow = new BrowserWindow({
    width: 1280 ,
    height: 720,
    title:"Techadam",
    frame:true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadFile('views/index.html');
}


app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

//liasion render preload
ipcMain.on("pass_account",(event,arg)=>{
  mainWindow.loadFile('views/main.html');
});

ipcMain.on("close",(event,arg)=>{
  if (process.platform !== 'darwin') app.quit()
});