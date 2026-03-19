import { app, BrowserView, BrowserWindow, ipcMain } from "electron";
import path from "path";

function createGMapWindow() {
  const gmapWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: {
      preload: path.join(__dirname, "../preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  gmapWindow.loadURL("https://www.google.com/maps");
}

ipcMain.on("open-gmap", () => {
  app.whenReady().then(createGMapWindow);
});
