jest.setTimeout(30000);

import { Browser, Page } from "puppeteer-core";
import { PuppeteerPageHandle } from "../../2_infrastructure/puppeteer/PuppeteerPageHandle";
import * as ctx from "../setup/test-context";
import { createTestContext, teardown } from "../setup/launchElectron";

describe("PuppeteerPageHandle - Google Maps home", () => {
  let page: Page;
  let browser: Browser;

  beforeAll(async () => {
    const ctxResult = await createTestContext(ctx.GOOGLE_MAP_URL);
    browser = ctxResult.browser;
    page = ctxResult.page;
  });

  afterAll(async () => {
    await browser?.disconnect();
    await browser?.close();
    teardown();
  });

  describe("find()", () => {
    it("throws Not found when the selector does not match any element", async () => {
      const selector = 'xpath///input[@id="khong-ton-tai"]';
      const pageHandle = new PuppeteerPageHandle(page);

      await expect(pageHandle.find(selector)).rejects.toThrow(
        `Not found: ${selector}`,
      );
    });

    it("returns the search input when the selector is valid", async () => {
      const selector =
        'xpath///input[@id=//label[normalize-space(text())="Tìm kiếm trên Google Maps"]/@for]';
      const pageHandle = new PuppeteerPageHandle(page);

      await expect(pageHandle.find(selector)).resolves.toBeDefined();
    });
  });
});

describe("PuppeteerPageHandle - Google Maps search results", () => {
  let page: Page;
  let browser: Browser;

  beforeAll(async () => {
    const ctxResult = await createTestContext(ctx.GOOGLE_MAPS_QUERY_SEARCH_URL);
    browser = ctxResult.browser;
    page = ctxResult.page;
  });

  afterAll(async () => {
    await browser?.disconnect();
    await browser?.close();
    teardown();
  });

  describe("findAll()", () => {
    it("returns result items when the selector is valid", async () => {
      const selector = `xpath///div[@aria-label="Kết quả cho ${ctx.SEARCH_KEYWORD}"]//a/parent::*`;

      const pageHandle = new PuppeteerPageHandle(page);
      const elementHandles = await pageHandle.findAll(selector);

      expect(elementHandles.length).toBeGreaterThan(0);
    });

    // still more, assess the above first
  });
});
