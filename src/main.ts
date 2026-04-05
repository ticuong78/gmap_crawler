import type { Page } from "puppeteer-core";
import { Queue } from "@src/1_application/data_structure/Queue";
import { CollectPlaceUrlUseCase } from "@src/1_application/usecases/CollectPlaceUrlUseCase";
import { ConsoleLogger } from "@src/2_infrastructure/loggers/ConsoleLogger";
import { PuppeteerPageHandle } from "@src/2_infrastructure/puppeteer/PuppeteerPageHandle";

export type MainComposition = {
  logger: ConsoleLogger;
  pageHandle: PuppeteerPageHandle;
  urlQueue: Queue<string>;
  collectPlaceUrlUseCase: CollectPlaceUrlUseCase;
};

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
