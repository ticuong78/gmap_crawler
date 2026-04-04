jest.setTimeout(30000);

import { PuppeteerPageHandle } from "../../2_infrastructure/puppeteer/PuppeteerPageHandle";

describe("PuppeteerPageHandle - Google Maps home", () => {
  let testingContext: ReturnType<typeof globalThis.createTestingContext>;
  let electronEnv: ReturnType<
    typeof globalThis.createAndSetupElectronEnvironment
  >;

  beforeAll(async () => {
    electronEnv = await globalThis.createAndSetupElectronEnvironment();
    testingContext = globalThis.createTestingContext(electronEnv);
    await testingContext.page.goto(globalThis.GOOGLE_MAP_URL);
  });

  afterAll(async () => {
    await globalThis.teardownTestRuntime({
      testingContext: testingContext,
      electronEnvironment: electronEnv,
    });
  });
  describe("find()", () => {
    it("throws Not found when the selector does not match any element", async () => {
      const selector = 'xpath///input[@id="khong-ton-tai"]';
      const pageHandle = new PuppeteerPageHandle(testingContext.page);

      await expect(pageHandle.find(selector)).rejects.toThrow(
        `Not found: ${selector}`,
      );
    });

    it("returns the search input when the selector is valid", async () => {
      const selector =
        'xpath///input[@id=//label[normalize-space(text())="Tìm kiếm trên Google Maps"]/@for]';
      const pageHandle = new PuppeteerPageHandle(testingContext.page);

      await expect(pageHandle.find(selector)).resolves.toBeDefined();
    });
  });
});

describe("PuppeteerPageHandle - Google Maps search results", () => {
  let testingContext: ReturnType<typeof globalThis.createTestingContext>;
  let electronEnv: ReturnType<
    typeof globalThis.createAndSetupElectronEnvironment
  >;

  beforeAll(async () => {
    electronEnv = await globalThis.createAndSetupElectronEnvironment();
    testingContext = globalThis.createTestingContext(electronEnv);
    await testingContext.page.goto(globalThis.GOOGLE_MAPS_QUERY_SEARCH_URL);
  });

  afterAll(async () => {
    await globalThis.teardownTestRuntime({
      testingContext: testingContext,
      electronEnvironment: electronEnv,
    });
  });

  describe("findAll()", () => {
    it("returns result items when the selector is valid", async () => {
      const selector = `xpath///div[@aria-label="Kết quả cho ${globalThis.SEARCH_KEYWORD}"]//a/parent::*`;

      const pageHandle = new PuppeteerPageHandle(testingContext.page);
      const elementHandles = await pageHandle.findAll(selector);

      expect(elementHandles.length).toBeGreaterThan(0);
    });

    // still more, assess the above first
  });
});
