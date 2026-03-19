import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
let mainWindow: BrowserWindow;

const isDev = (process.env.NODE_ENV = "development");

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../interface"));
  }
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
