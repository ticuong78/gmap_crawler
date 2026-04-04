jest.setTimeout(30000);

import { IElementHandle } from "../../1_application/ports/IElementHandle";

import { PuppeteerElementHandle } from "../../2_infrastructure/puppeteer/PuppeteerElementHandle";
import { PuppeteerPageHandle } from "../../2_infrastructure/puppeteer/PuppeteerPageHandle";

describe("PuppeteerElementHandle - Google Maps search results", () => {
  let searchResultPanelHandle: IElementHandle;
  let placeHandles: IElementHandle[];
  let testingContext: ReturnType<typeof globalThis.createTestingContext>;
  let electronEnv: ReturnType<
    typeof globalThis.createAndSetupElectronEnvironment
  >;

  beforeAll(async () => {
    electronEnv = await globalThis.createAndSetupElectronEnvironment();
    testingContext = globalThis.createTestingContext(electronEnv);
    await testingContext.page.goto(globalThis.GOOGLE_MAPS_QUERY_SEARCH_URL);

    const selector = `xpath///div[@aria-label="Kết quả cho ${globalThis.SEARCH_KEYWORD}"]`;
    const handle = await testingContext.page.$(selector);

    if (!handle) {
      throw new Error(
        `Cannot find element for selector ${selector} while testing`,
      );
    }

    searchResultPanelHandle = new PuppeteerElementHandle(handle);
  });

  afterAll(async () => {
    await globalThis.teardownTestRuntime({
      testingContext: testingContext,
      electronEnvironment: electronEnv,
    });
  });

  describe("find()", () => {
    it("returns the end of search result element when the selector is valid", async () => {
      const selector = "xpath///span[text()='Bạn đã xem hết danh sách này.']";

      const endOfSearchElement = await searchResultPanelHandle.find(selector);

      expect(endOfSearchElement).toBeDefined();
    });

    it("throws Not Found error when the selector is invalid", async () => {
      const selector =
        "xpath///span[text()='Bạn chưa xem hết danh sách này đâu nhé.']";
      const pageHandle = new PuppeteerPageHandle(testingContext.page);

      await expect(pageHandle.find(selector)).rejects.toThrow(
        `Not found: ${selector}`,
      );
    });
  });

  describe("findAll()", () => {
    it("result items when the selector is valid", async () => {
      const selector = `xpath///a[@href]/parent::*`;

      placeHandles = await searchResultPanelHandle.findAll(selector);

      expect(placeHandles.length).toBeGreaterThan(0);
    });
  });

  describe("click()", () => {
    it("shows place detail and returns the same handle", async () => {
      const placeHandle = placeHandles[0];

      const expectedSamePlaceHandle = await placeHandle.click();

      const detailPlace = await testingContext.page.waitForSelector(
        "xpath///div[contains(@aria-label, 'Các thao tác dành cho')]",
        {
          timeout: 2000,
        },
      );

      expect(detailPlace).toBeDefined();
      expect(expectedSamePlaceHandle).toStrictEqual(placeHandle);
    });
  });
});

// describe("findAll()", () => {
//   it("result items when the selector is valid", async () => {
//     const selector = `xpath///a[@href]/parent::*`;

//     placeHandles = await searchResultPanelHandle.findAll(selector);

//     expect(placeHandles.length).toBeGreaterThan(0);
//   });
// });

// describe("click()", () => {
//   it("clicks the place handle and returns the same handle", async () => {
//     const placeHandle = placeHandles[0];

//     const expectedSamePlaceHandle = await placeHandle.click();

//     expect(expectedSamePlaceHandle).toStrictEqual(placeHandle);
//   });
// });
