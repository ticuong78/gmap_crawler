jest.setTimeout(60000);

import { IElementHandle } from "@src/1_application/ports/IElementHandle";
import {
  createNormalTestingContext,
  type TestingContext,
} from "@tests/integration/support/context";
import {
  findGoogleMapsResultsFeed,
  GOOGLE_MAPS_PLACE_LINK_SELECTOR,
  waitForGoogleMapsPlaceLinks,
} from "@tests/integration/support/google-maps";
import { shouldRunFullLiveGoogleMapsTests } from "@tests/integration/support/live-google-maps";
import { PuppeteerElementHandle } from "@src/2_infrastructure/puppeteer/PuppeteerElementHandle";
import { PuppeteerPageHandle } from "@src/2_infrastructure/puppeteer/PuppeteerPageHandle";

const itFullLiveGoogleMaps = shouldRunFullLiveGoogleMapsTests ? it : it.skip;

describe("PuppeteerElementHandle - Google Maps search results", () => {
  let searchResultPanelHandle: IElementHandle;
  let placeHandles: IElementHandle[];
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

    const handle = await findGoogleMapsResultsFeed(testingContext.page);
    await waitForGoogleMapsPlaceLinks(testingContext.page);

    searchResultPanelHandle = new PuppeteerElementHandle(handle);
    placeHandles = await searchResultPanelHandle.findAll(
      GOOGLE_MAPS_PLACE_LINK_SELECTOR,
    );
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

    itFullLiveGoogleMaps(
      "throws Not Found error when the selector is invalid",
      async () => {
        const selector = 'span[data-testid="khong-ton-tai"]';
        const pageHandle = new PuppeteerPageHandle(testingContext.page);

        await expect(pageHandle.find(selector)).rejects.toThrow(
          `Not found: ${selector}`,
        );
      },
    );
  });

  describe("findAll()", () => {
    itFullLiveGoogleMaps("result items when the selector is valid", async () => {
      const selector = GOOGLE_MAPS_PLACE_LINK_SELECTOR;

      const resultPlaceHandles =
        await searchResultPanelHandle.findAll(selector);

      expect(resultPlaceHandles.length).toBeGreaterThan(0);
    });
  });

  describe("click()", () => {
    it("shows place detail and returns the same handle", async () => {
      const placeHandle = placeHandles[0];

      const detailNavigationPromise = testingContext.page.waitForFunction(
        () => window.location.href.includes("/maps/place/"),
        {
          timeout: 15000,
        },
      );
      const expectedSamePlaceHandle = await placeHandle.click();
      await detailNavigationPromise;

      const detailPlace = await testingContext.page.waitForSelector(
        'div[role="main"][aria-label] button[data-item-id="address"]',
        {
          timeout: 15000,
        },
      );

      expect(detailPlace).toBeDefined();
      expect(expectedSamePlaceHandle).toStrictEqual(placeHandle);
    });
  });
});

describe("PuppeteerElementHandle - DOM fixture", () => {
  let testingContext: TestingContext;
  let pageHandle: PuppeteerPageHandle;

  beforeAll(async () => {
    testingContext = await createNormalTestingContext();
    pageHandle = new PuppeteerPageHandle(testingContext.page);
    await testingContext.page.setViewport({ width: 1280, height: 720 });
  });

  beforeEach(async () => {
    await testingContext.page.setViewport({ width: 1280, height: 720 });
    await testingContext.page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <body style="margin: 0; padding: 16px;">
          <input id="type-target" />
          <button
            id="hover-target"
            data-hovered="false"
            onmouseover="this.setAttribute('data-hovered', 'true')"
          >
            Hover target
          </button>
          <div id="text-target" data-role="summary">Hello <span>world</span></div>
          <div id="visible-box">Visible box</div>
          <div id="hidden-box" style="display: none;">Hidden box</div>
          <div
            id="scrollable-panel"
            style="height: 120px; overflow-y: auto; border: 1px solid #000;"
          >
            <div id="scrollable-content" style="height: 600px;">
              Scrollable content
            </div>
          </div>
          <div id="above-fold" style="margin-top: 24px; height: 40px;">
            Above fold
          </div>
          <div style="height: 1200px;"></div>
          <div id="below-fold" style="height: 40px;">Below fold</div>
        </body>
      </html>
    `);

    await testingContext.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  });

  afterAll(async () => {
    await testingContext?.teardown();
  });

  describe("type()", () => {
    it("types into an input and returns the same handle", async () => {
      const inputHandle = await pageHandle.find("#type-target");

      const expectedSameInputHandle = await inputHandle.type("kaiserin");
      const value = await testingContext.page.$eval(
        "#type-target",
        (el) => (el as HTMLInputElement).value,
      );

      expect(value).toBe("kaiserin");
      expect(expectedSameInputHandle).toStrictEqual(inputHandle);
    });
  });

  describe("hover()", () => {
    it("dispatches hover events and returns the same handle", async () => {
      const hoverHandle = await pageHandle.find("#hover-target");

      const expectedSameHoverHandle = await hoverHandle.hover();
      const hovered = await testingContext.page.$eval("#hover-target", (el) =>
        el.getAttribute("data-hovered"),
      );

      expect(hovered).toBe("true");
      expect(expectedSameHoverHandle).toStrictEqual(hoverHandle);
    });
  });

  describe("getText()", () => {
    it("returns the element text content", async () => {
      const textHandle = await pageHandle.find("#text-target");

      await expect(textHandle.getText()).resolves.toBe("Hello world");
    });
  });

  describe("getAttribute()", () => {
    it("returns the attribute value and empty string when missing", async () => {
      const textHandle = await pageHandle.find("#text-target");

      await expect(textHandle.getAttribute("data-role")).resolves.toBe(
        "summary",
      );
      await expect(textHandle.getAttribute("data-missing")).resolves.toBe("");
    });
  });

  describe("getHTML()", () => {
    it("returns the element outer HTML", async () => {
      const textHandle = await pageHandle.find("#text-target");

      const html = await textHandle.getHTML();

      expect(html).toContain('id="text-target"');
      expect(html).toContain('data-role="summary"');
      expect(html).toContain("<span>world</span>");
    });
  });

  describe("isVisible()", () => {
    it("distinguishes visible and hidden elements", async () => {
      const visibleHandle = await pageHandle.find("#visible-box");
      const hiddenHandle = await pageHandle.find("#hidden-box");

      await expect(visibleHandle.isVisible()).resolves.toBe(true);
      await expect(hiddenHandle.isVisible()).resolves.toBe(false);
    });
  });

  describe("isIntersectingViewport()", () => {
    it("returns true only when the element is inside the viewport", async () => {
      const aboveFoldHandle = await pageHandle.find("#above-fold");
      const belowFoldHandle = await pageHandle.find("#below-fold");

      await expect(aboveFoldHandle.isIntersectingViewport()).resolves.toBe(
        true,
      );
      await expect(belowFoldHandle.isIntersectingViewport()).resolves.toBe(
        false,
      );
    });
  });

  describe("scroll()", () => {
    it("scrolls a vertically scrollable element and returns the same handle", async () => {
      const scrollablePanelHandle = await pageHandle.find("#scrollable-panel");
      const beforeScrollTop = await testingContext.page.$eval(
        "#scrollable-panel",
        (el) => el.scrollTop,
      );

      const expectedSamePanelHandle = await scrollablePanelHandle.scroll({
        pixel: 120,
      });
      const afterScrollTop = await testingContext.page.$eval(
        "#scrollable-panel",
        (el) => el.scrollTop,
      );

      expect(afterScrollTop).toBeGreaterThan(beforeScrollTop);
      expect(expectedSamePanelHandle).toStrictEqual(scrollablePanelHandle);
    });

    it("throws when the handle itself is not vertically scrollable", async () => {
      const nonScrollableHandle = await pageHandle.find("#scrollable-content");

      await expect(nonScrollableHandle.scroll({ pixel: 120 })).rejects.toThrow(
        "Element is not vertically scrollable",
      );
    });
  });
});
