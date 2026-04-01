import { app, BrowserWindow } from "electron";
import * as puppeteer from "puppeteer-core";
import * as pie from "puppeteer-in-electron";

import { CollectPlaceInfoUseCase } from "../1_application/usecases/CollectPlaceInfoUseCase";
import { PuppeteerPlaceDetector } from "../2_infrastructure/detectors/puppeteer/PuppeteerPlaceDetector";
import { PuppeteerPanelDetector } from "../2_infrastructure/detectors/puppeteer/PuppeteerPanelDetector";
import { PuppeteerPlaceClicker } from "../2_infrastructure/detectors/puppeteer/PuppeteerPlaceClicker";

import { ConsoleLogger } from "../2_infrastructure/loggers/ConsoleLogger";
import { PuppeteerPlaceCrawler } from "../2_infrastructure/detectors/puppeteer/PuppeteerPlaceCrawler";

async function main(window: BrowserWindow) {
  // Connect Puppeteer vào Electron BrowserWindow
  const debuggerUrl = window.webContents.getURL();
  const browser = await pie.connect(app, puppeteer);

  const url = "https://maps.google.com/maps";
  await window.loadURL(url);

  const page = await pie.getPage(browser, window);

  // Infrastructure
  const logger = new ConsoleLogger();
  const placeDetector = new PuppeteerPlaceDetector({
    type: "page",
    value: page,
  });
  const panelDetector = new PuppeteerPanelDetector();
  const clicker = new PuppeteerPlaceClicker();
  const crawler = new PuppeteerPlaceCrawler();

  // Composition
  const collectPlaceInfoUseCase = new CollectPlaceInfoUseCase(
    logger,
    placeDetector,
    panelDetector,
    clicker,
    crawler,
  );

  // Execute
  await collectPlaceInfoUseCase.execute(
    ".place-card", // TODO: thay bằng selector thật
    ".place-panel", // TODO: thay bằng selector thật
  );
}

app.whenReady().then(() => {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window.loadURL("https://maps.google.com");
  window.webContents.on("did-finish-load", () => main(window));
});
