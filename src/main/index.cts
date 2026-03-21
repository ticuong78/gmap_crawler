import "dotenv/config";

import path from "path";
import pie from "puppeteer-in-electron";
import { app, BrowserWindow } from "electron";

import { createWindow, windowOptions } from "./window.cjs";
import { setupGmap, teardownGmap } from "./gmap.cjs";

const isDev = process.env.NODE_ENV === "development";

let mainWindow: BrowserWindow;

pie.initialize(app);

app.whenReady().then(async () => {
  mainWindow = createWindow(windowOptions);
  await setupGmap(mainWindow);

  if (isDev) await mainWindow.loadURL("http://localhost:5173");
  else
    await mainWindow.loadFile(path.join(__dirname, "../../../dist/index.html"));
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", async () => {
  await teardownGmap();
  mainWindow?.close();
});
