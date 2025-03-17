
require('electron-reload')(__dirname);
const { app, BrowserWindow } = require('electron');
const path = require('path');


function createWindow() {
  // Create a new browser window
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load the index.html file (which will contain your game's frontend)
  win.loadFile('public/index.html');
}

app.whenReady().then(createWindow);

// Quit app when all windows are closed (except for macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
