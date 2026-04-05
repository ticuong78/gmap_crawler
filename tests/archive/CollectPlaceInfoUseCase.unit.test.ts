import * as puppeteer from "puppeteer-core";

import { ILogger } from "../../src/1_application/ports/ILogger";

describe("CollectPlaceInfoUseCase - Mock Kaiserin Search Result Page", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  let logger: ILogger;

  beforeAll(async () => {
    logger = globalThis.createLogger();
    ({ browser, page } = await globalThis.createNormalTestingContext());
    const mockKaiserinSearchResultPage: string =
      await globalThis.readMockAssets("mockKaiserinSearchResultPage");

    await page.setContent(mockKaiserinSearchResultPage);
  });

  afterAll(async () => {
    const composedTestingContext = await globalThis.comopseTestingContext(
      browser,
      page,
    );

    await globalThis.teardownTestRuntime({
      testingContext: composedTestingContext,
    });
  });

  // describe("execute()", () => {
  //   const pageHandle = new

  // });
});
