import { Browser, Page } from "puppeteer-core";
import { createTestContext } from "./setup/launchPuppeteer";
import {
  PuppeteerPlaceDetector,
  ScopeContext,
} from "../2_infrastructure/detectors/puppeteer/PuppeteerPlaceDetector";

// const URL = "https://www.google.com/maps/search/kaiserin";
const URL = "https://www.google.com/maps/";

describe("PuppeteerPlaceDetector - Integration", () => {
  let page: Page;
  let browser: Browser;

  // Chạy một lần cho cả suite — vì launch browser chậm
  beforeAll(async () => {
    ({ browser, page } = await createTestContext(URL));
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("detect() từ Page", () => {
    it("tìm thấy kết quả trên Google Maps", async () => {
      const context: ScopeContext = { type: "page", value: page };
      const detector = new PuppeteerPlaceDetector(context);

      const results = await detector.detect(".some-real-selector");

      expect(results.length).toBeGreaterThan(0);
    });
  });
});
