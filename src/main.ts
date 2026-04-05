import type { Page } from "puppeteer-core";
import { Queue } from "@src/1_application/data_structure/Queue";
import { CollectPlaceUrlUseCase } from "@src/1_application/usecases/CollectPlaceUrlUseCase";
import { ConsoleLogger } from "@src/2_infrastructure/loggers/ConsoleLogger";
import { PuppeteerPageHandle } from "@src/2_infrastructure/puppeteer/PuppeteerPageHandle";
import * as pie from "puppeteer-in-electron";
import { app, BrowserWindow } from "electron";
import * as puppeteer from "puppeteer-core";

export type MainComposition = {
  logger: ConsoleLogger;
  pageHandle: PuppeteerPageHandle;
  urlQueue: Queue<string>;
  collectPlaceUrlUseCase: CollectPlaceUrlUseCase;
};

export async function createPIE() {
  // Initialize puppeteer-in-electron
  await pie.initialize(app);

  // Connect Puppeteer to Electron
  const browser = await pie.connect(app, puppeteer);

  // Create a new Electron window
  const window = new BrowserWindow();

  const page = await pie.getPage(browser, window);

  return page;
}

export function createMainComposition(page: Page): MainComposition {
  const logger = new ConsoleLogger();
  const pageHandle = new PuppeteerPageHandle(page);
  const urlQueue = new Queue<string>();
  const collectPlaceUrlUseCase = new CollectPlaceUrlUseCase(
    logger,
    pageHandle,
    urlQueue,
  );

  return {
    logger,
    pageHandle,
    urlQueue,
    collectPlaceUrlUseCase,
  };
}

const page = await createPIE();

const { logger, pageHandle, urlQueue, collectPlaceUrlUseCase } =
  createMainComposition(page);

collectPlaceUrlUseCase.execute();
