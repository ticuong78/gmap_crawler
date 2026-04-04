jest.setTimeout(30000);

import { PuppeteerPageHandle } from "../../2_infrastructure/puppeteer/PuppeteerPageHandle";

describe("PuppeteerPageHandle - Google Maps home", () => {
  let testingContext: Awaited<ReturnType<typeof globalThis.createTestingContext>>;
  let electronEnv: Awaited<ReturnType<
    typeof globalThis.createAndSetupElectronEnvironment
  >>;

  beforeAll(async () => {
    electronEnv = await globalThis.createAndSetupElectronEnvironment();
    testingContext = await globalThis.createTestingContext(electronEnv);
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
      const selector = 'input[data-testid="khong-ton-tai"]';
      const pageHandle = new PuppeteerPageHandle(testingContext.page);

      await expect(pageHandle.find(selector)).rejects.toThrow(
        `Not found: ${selector}`,
      );
    });

    it("returns the search input when the selector is valid", async () => {
      const selector = 'input[role="combobox"][name="q"]';
      const pageHandle = new PuppeteerPageHandle(testingContext.page);

      await expect(pageHandle.find(selector)).resolves.toBeDefined();
    });
  });
});

describe("PuppeteerPageHandle - Google Maps search results", () => {
  let testingContext: Awaited<ReturnType<typeof globalThis.createTestingContext>>;
  let electronEnv: Awaited<ReturnType<
    typeof globalThis.createAndSetupElectronEnvironment
  >>;

  beforeAll(async () => {
    electronEnv = await globalThis.createAndSetupElectronEnvironment();
    testingContext = await globalThis.createTestingContext(electronEnv);
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
      const selector = `div[role="feed"][aria-label*="${globalThis.SEARCH_KEYWORD}"] div[role="article"]`;

      await testingContext.page.waitForSelector(selector, {
        timeout: 10000,
      });

      const pageHandle = new PuppeteerPageHandle(testingContext.page);
      const elementHandles = await pageHandle.findAll(selector);

      expect(elementHandles.length).toBeGreaterThan(0);
    });

    // still more, assess the above first
  });
});
