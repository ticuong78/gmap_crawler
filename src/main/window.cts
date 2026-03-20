import path from "path";
import { BrowserWindow } from "electron";

export const windowOptions: Electron.BrowserWindowConstructorOptions = {
  height: 800,
  width: 1200,
  frame: true,
  webPreferences: {
    preload: path.join(__dirname, "../preload/index.cjs"),
    contextIsolation: true,
    nodeIntegration: true,
  },
};

export function createWindow(
  options: Electron.BrowserWindowConstructorOptions,
) {
  return new BrowserWindow(options);
}
