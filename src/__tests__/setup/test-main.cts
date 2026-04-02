import { app, BrowserWindow } from "electron";

app.whenReady().then(() => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.webContents.setAudioMuted(true);
  win.loadURL("about:blank");

  // Đợi window load xong rồi mới signal ready
  win.webContents.once("did-finish-load", () => {
    console.log("ELECTRON_READY");
  });
});
