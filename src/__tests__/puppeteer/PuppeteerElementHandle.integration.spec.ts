jest.setTimeout(30000);

import { IElementHandle } from "../../1_application/ports/IElementHandle";

import { PuppeteerElementHandle } from "../../2_infrastructure/puppeteer/PuppeteerElementHandle";
import { PuppeteerPageHandle } from "../../2_infrastructure/puppeteer/PuppeteerPageHandle";

describe("PuppeteerElementHandle - Google Maps search results", () => {
  let searchResultPanelHandle: IElementHandle;
  let placeHandles: IElementHandle[];
  let testingContext: Awaited<ReturnType<typeof globalThis.createTestingContext>>;
  let electronEnv: Awaited<ReturnType<
    typeof globalThis.createAndSetupElectronEnvironment
  >>;

  beforeAll(async () => {
    electronEnv = await globalThis.createAndSetupElectronEnvironment();
    testingContext = await globalThis.createTestingContext(electronEnv);
    await testingContext.page.goto(globalThis.GOOGLE_MAPS_QUERY_SEARCH_URL);

    const selector = `div[role="feed"][aria-label*="${globalThis.SEARCH_KEYWORD}"]`;
    const handle = await testingContext.page.waitForSelector(selector, {
      timeout: 10000,
    });

    searchResultPanelHandle = new PuppeteerElementHandle(handle);
  });

  afterAll(async () => {
    await globalThis.teardownTestRuntime({
      testingContext: testingContext,
      electronEnvironment: electronEnv,
    });
  });

  describe("find()", () => {
    it("returns the first result item when the selector is valid", async () => {
      const selector = 'div[role="article"]';

      const resultItemElement = await searchResultPanelHandle.find(selector);

      expect(resultItemElement).toBeDefined();
    });

    it("throws Not Found error when the selector is invalid", async () => {
      const selector = 'span[data-testid="khong-ton-tai"]';
      const pageHandle = new PuppeteerPageHandle(testingContext.page);

      await expect(pageHandle.find(selector)).rejects.toThrow(
        `Not found: ${selector}`,
      );
    });
  });

  describe("findAll()", () => {
    it("result items when the selector is valid", async () => {
      const selector = 'div[role="article"] a[href*="/maps/place/"][aria-label]';

      placeHandles = await searchResultPanelHandle.findAll(selector);

      expect(placeHandles.length).toBeGreaterThan(0);
    });
  });

  describe("click()", () => {
    it("shows place detail and returns the same handle", async () => {
      const placeHandle = placeHandles[0];

      const detailNavigationPromise = testingContext.page.waitForFunction(
        () => window.location.href.includes("/maps/place/"),
        {
          timeout: 5000,
        },
      );
      const expectedSamePlaceHandle = await placeHandle.click();
      await detailNavigationPromise;

      const detailPlace = await testingContext.page.waitForSelector(
        'div[role="main"][aria-label] button[data-item-id="address"]',
        {
          timeout: 5000,
        },
      );

      expect(detailPlace).toBeDefined();
      expect(expectedSamePlaceHandle).toStrictEqual(placeHandle);
    });
  });
});
