jest.setTimeout(30000);

import { Browser, Page } from "puppeteer-core";
import { createTestContext, teardown } from "../setup/launchPuppeteer";
import { PuppeteerPageHandle } from "../../2_infrastructure/puppeteer/PuppeteerPageHandle";

const GOOGLE_MAPS_URL: string = "https://www.google.com/maps";

describe("PuppeteerPageHandle - Google Maps home", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    ({ browser, page } = await createTestContext(GOOGLE_MAPS_URL));
  });

  afterAll(async () => {
    await browser?.close();
    await browser?.disconnect();
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

const SEARCH_KEYWORD = "kaiserin";
const GOOGLE_MAPS_QUERY_SEARCH_URL: string = `https://www.google.com/maps/search/${SEARCH_KEYWORD}`;

describe("PuppeteerPageHandle - Google Maps search results", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    ({ browser, page } = await createTestContext(GOOGLE_MAPS_QUERY_SEARCH_URL));
  });

  afterAll(async () => {
    await browser?.close();
    await browser?.disconnect();
    teardown();
  });

  describe("findAll()", () => {
    it("returns result items when the selector is valid", async () => {
      const selector = `xpath///div[@aria-label="Kết quả cho ${SEARCH_KEYWORD}"]//a/parent::*`;

      const pageHandle = new PuppeteerPageHandle(page);
      const elementHandles = await pageHandle.findAll(selector);

      expect(elementHandles.length).toBeGreaterThan(0);
    });

    // still more, assess the above first
  });
});
