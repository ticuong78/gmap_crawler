import path from "path";
import pie from "puppeteer-in-electron";
import * as puppeteer from "puppeteer-core";
import { app, BrowserWindow, ipcMain } from "electron";
import { gaussianRandom, randomNumber } from "./utils.cjs";

const isDev = process.env.NODE_ENV === "development";

function createWindow(options: Electron.BrowserWindowConstructorOptions) {
  const window = new BrowserWindow(options);

  return window;
}

let mainWindow: BrowserWindow;
let gmapWindow: BrowserWindow;
let gmapBrowser: puppeteer.Browser;
let gmapPage: puppeteer.Page;

const xpathConditions: string =
  'contains(text(),"Tìm kiếm trên Google Maps") or contains(text(),"Search Google Maps")';

const searchBoxSelector: string = `//input[@id=//label[${xpathConditions}]/@for]`;
let searchBox: puppeteer.ElementHandle<Element> | null;

const windowOptions = {
  height: 800,
  width: 1200,
  frame: true,
  webPreferences: {
    preload: path.join(__dirname, "preload.cjs"),
    contextIsolation: true,
    nodeIntegration: true,
  },
};

pie.initialize(app);

app.whenReady().then(async () => {
  mainWindow = createWindow(windowOptions);

  gmapBrowser = await pie.connect(app, puppeteer);
  gmapWindow = createWindow({
    ...windowOptions,
    show: false,
  });

  if (isDev) await mainWindow.loadURL("http://localhost:5173");
  else await mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", async () => {
  await gmapPage?.close();
  gmapWindow?.close();
});

// ------- Events handlers -------

ipcMain.on("gmap:open", async (_event, showWindow: boolean = true) => {
  if (gmapWindow.isDestroyed()) {
    gmapWindow = createWindow({
      ...windowOptions,
      show: false,
    });
  }

  gmapPage = await pie.getPage(gmapBrowser, gmapWindow);

  await gmapPage.goto("https://google.com/maps");

  const inputId = await gmapPage.$eval(
    `::-p-xpath(//label[${xpathConditions}])`,
    (el) => el.getAttribute("for"),
  );

  searchBox = await gmapPage.$(`#${inputId}`);

  if (!searchBox) throw Error("Không thể tìm thấy Search Box.");

  if (showWindow) gmapWindow.show();
});

ipcMain.on("gmap:search", async (_event, keyword: string) => {
  if (!searchBox || !gmapPage) {
    throw Error("Chưa mở Google Maps.");
  }

  await searchBox?.click({
    clickCount: 3,
    delay: Math.max(200, gaussianRandom(600, 150)),
  });

  await searchBox?.type(keyword, {
    delay: Math.max(50, gaussianRandom(120, 30)),
  });

  await gmapPage.keyboard.press("Enter");
});
