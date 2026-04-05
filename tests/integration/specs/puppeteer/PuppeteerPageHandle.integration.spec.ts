import {
  createNormalTestingContext,
  type TestingContext,
} from "@tests/integration/support/context";
import { PuppeteerPageHandle } from "@src/2_infrastructure/puppeteer/PuppeteerPageHandle";
import {
  GOOGLE_MAPS_PLACE_LINK_SELECTOR,
  waitForGoogleMapsPlaceLinks,
} from "@tests/integration/support/google-maps";
import { shouldRunLiveGoogleMapsTests } from "@tests/integration/support/live-google-maps";

jest.setTimeout(60000);

const describeLiveGoogleMaps = shouldRunLiveGoogleMapsTests
  ? describe
  : describe.skip;

describeLiveGoogleMaps("PuppeteerPageHandle - Google Maps home", () => {
  let testingContext: Awaited<
    ReturnType<typeof globalThis.createElectronTestingContext>
  >;
  let electronEnv: Awaited<
    ReturnType<typeof globalThis.createAndSetupElectronEnvironment>
  >;

  beforeAll(async () => {
    electronEnv = await globalThis.createAndSetupElectronEnvironment();
    testingContext = await globalThis.createElectronTestingContext(electronEnv);
    await testingContext.page.goto(globalThis.GOOGLE_MAP_URL, {
      waitUntil: "domcontentloaded",
    });
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
      const selector = 'input[role="combobox"]';
      const pageHandle = new PuppeteerPageHandle(testingContext.page);

      await expect(pageHandle.find(selector)).resolves.toBeDefined();
    });
  });
});

describeLiveGoogleMaps("PuppeteerPageHandle - Google Maps search results", () => {
  let testingContext: Awaited<
    ReturnType<typeof globalThis.createElectronTestingContext>
  >;
  let electronEnv: Awaited<
    ReturnType<typeof globalThis.createAndSetupElectronEnvironment>
  >;

  beforeAll(async () => {
    electronEnv = await globalThis.createAndSetupElectronEnvironment();
    testingContext = await globalThis.createElectronTestingContext(electronEnv);
    await testingContext.page.goto(globalThis.GOOGLE_MAPS_QUERY_SEARCH_URL, {
      waitUntil: "domcontentloaded",
    });
  });

  afterAll(async () => {
    await globalThis.teardownTestRuntime({
      testingContext: testingContext,
      electronEnvironment: electronEnv,
    });
  });

  describe("findAll()", () => {
    it("returns result items when the selector is valid", async () => {
      const selector = GOOGLE_MAPS_PLACE_LINK_SELECTOR;

      await waitForGoogleMapsPlaceLinks(testingContext.page);

      const pageHandle = new PuppeteerPageHandle(testingContext.page);
      const elementHandles = await pageHandle.findAll(selector);

      expect(elementHandles.length).toBeGreaterThan(0);
    });
  });
});

describe("PuppeteerPageHandle - DOM fixture", () => {
  let testingContext: TestingContext;
  let pageHandle: PuppeteerPageHandle;

  beforeAll(async () => {
    testingContext = await createNormalTestingContext();
    pageHandle = new PuppeteerPageHandle(testingContext.page);
  });

  beforeEach(async () => {
    await testingContext.page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <body>
          <input id="search-input" />
          <ul>
            <li class="item">first</li>
            <li class="item">second</li>
            <li class="item">third</li>
          </ul>
        </body>
      </html>
    `);
  });

  afterAll(async () => {
    await testingContext?.teardown();
  });

  describe("find()", () => {
    it("throws Not found when the selector does not match any element", async () => {
      await expect(pageHandle.find('[data-testid="missing"]')).rejects.toThrow(
        'Not found: [data-testid="missing"]',
      );
    });

    it("returns the first matching element when the selector is valid", async () => {
      await expect(pageHandle.find("#search-input")).resolves.toBeDefined();
    });
  });

  describe("findAll()", () => {
    it("returns all matching elements when the selector is valid", async () => {
      const elementHandles = await pageHandle.findAll(".item");

      expect(elementHandles).toHaveLength(3);
    });
  });

  describe("goto()", () => {
    it("returns true when navigation succeeds", async () => {
      await expect(
        pageHandle.goto("data:text/html,<html><body><div id='ok'></div></body></html>"),
      ).resolves.toBe(true);
    });
  });
});
