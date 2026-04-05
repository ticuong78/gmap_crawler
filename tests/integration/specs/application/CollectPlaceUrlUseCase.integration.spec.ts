jest.setTimeout(90000);

import { Queue } from "@src/1_application/data_structure/Queue";
import { CollectPlaceUrlUseCase } from "@src/1_application/usecases/CollectPlaceUrlUseCase";
import { PuppeteerPageHandle } from "@src/2_infrastructure/puppeteer/PuppeteerPageHandle";
import {
  createNormalTestingContext,
  type TestingContext,
} from "@tests/integration/support/context";
import { findGoogleMapsResultsFeed } from "@tests/integration/support/google-maps";
import { shouldRunFullLiveGoogleMapsTests } from "@tests/integration/support/live-google-maps";

class ObservedQueue<T> extends Queue<T> {
  readonly history: T[] = [];
  readonly lengthSnapshots: number[] = [];

  override enqueue(element: T): void {
    super.enqueue(element);
    this.history.push(element);
    this.lengthSnapshots.push(this.length);
  }
}

function drainQueue<T>(queue: Queue<T>): T[] {
  const items: T[] = [];

  while (!queue.isEmpty) {
    items.push(queue.dequeue());
  }

  return items;
}

async function waitForCondition(
  condition: () => boolean,
  label: string,
  timeoutMs: number = 20000,
  intervalMs: number = 100,
): Promise<void> {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(`Timed out waiting for ${label}`);
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

const itFullLiveGoogleMaps = shouldRunFullLiveGoogleMapsTests ? it : it.skip;
const liveGoogleMapsSearchKeyword =
  process.env.TEST_GOOGLE_MAPS_SHORT_SEARCH_KEYWORD?.trim() ||
  "theatre washington dc";
const liveGoogleMapsQueryUrl = `https://www.google.com/maps/search/${encodeURIComponent(liveGoogleMapsSearchKeyword)}?hl=vi&gl=VN`;

describe("CollectPlaceUrlUseCase - DOM fixture", () => {
  let testingContext: TestingContext;

  beforeAll(async () => {
    testingContext = await createNormalTestingContext();
    await testingContext.page.setViewport({ width: 1280, height: 720 });
  });

  beforeEach(async () => {
    await testingContext.page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <body style="margin: 0; padding: 16px;">
          <div
            id="results-feed"
            role="feed"
            style="height: 180px; overflow-y: auto; border: 1px solid #000;"
          >
            <div id="feed-content">
              <div data-batch="initial" role="article">
                <a
                  class="place-url"
                  href="https://www.google.com/maps/place/alpha-theatre"
                >
                  Alpha Theatre
                </a>
              </div>
              <div data-batch="initial" role="article">
                <a
                  class="place-url"
                  href="https://www.google.com/maps/place/beta-theatre"
                >
                  Beta Theatre
                </a>
              </div>
              <div id="dynamic-slot"></div>
              <div id="stop-spacer" style="height: 720px;"></div>
              <div data-test-stop-signal="true" style="height: 24px;">
                Stop signal
              </div>
            </div>
          </div>

          <script>
            const feed = document.getElementById("results-feed");
            const dynamicSlot = document.getElementById("dynamic-slot");
            const stopSpacer = document.getElementById("stop-spacer");

            window.__testState = {
              loadMoreCount: 0,
            };

            feed.addEventListener("scroll", () => {
              if (window.__testState.loadMoreCount > 0 || feed.scrollTop < 120) {
                return;
              }

              window.__testState.loadMoreCount += 1;

              window.setTimeout(() => {
                document
                  .querySelectorAll('[data-batch="initial"]')
                  .forEach((element) => element.remove());

                dynamicSlot.innerHTML =
                  '<div data-batch="second" role="article">' +
                  '<a class="place-url" href="https://www.google.com/maps/place/gamma-theatre">' +
                  'Gamma Theatre' +
                  '</a>' +
                  '</div>' +
                  '<div data-batch="second" role="article">' +
                  '<a class="place-url" href="https://www.google.com/maps/place/delta-theatre">' +
                  'Delta Theatre' +
                  '</a>' +
                  '</div>';

                stopSpacer.style.height = "0px";
              }, 150);
            });
          </script>
        </body>
      </html>
    `);
  });

  afterAll(async () => {
    await testingContext?.teardown();
  });

  it("scrolls through the result panel and enqueues newly revealed URLs", async () => {
    const urlQueue = new ObservedQueue<string>();
    const callback = jest.fn();
    const useCase = new CollectPlaceUrlUseCase(
      globalThis.createLogger(),
      new PuppeteerPageHandle(testingContext.page),
      urlQueue,
    );

    await useCase.execute(
      "#results-feed",
      '[role="article"]',
      "a.place-url[href]",
      '[data-test-stop-signal="true"]',
      { pixel: 250, settleDelayMs: 250 },
      callback,
    );

    const collectedUrls = drainQueue(urlQueue);

    const testState = await testingContext.page.evaluate(
      () => (window as typeof window & { __testState: { loadMoreCount: number } }).__testState,
    );

    expect(collectedUrls).toStrictEqual([
      "https://www.google.com/maps/place/alpha-theatre",
      "https://www.google.com/maps/place/beta-theatre",
      "https://www.google.com/maps/place/gamma-theatre",
      "https://www.google.com/maps/place/delta-theatre",
    ]);
    expect(urlQueue.history).toStrictEqual(collectedUrls);
    expect(urlQueue.lengthSnapshots).toStrictEqual([1, 2, 3, 4]);
    expect(testState.loadMoreCount).toBe(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("CollectPlaceUrlUseCase - Google Maps live", () => {
  let testingContext: Awaited<
    ReturnType<typeof globalThis.createElectronTestingContext>
  >;
  let electronEnv: Awaited<
    ReturnType<typeof globalThis.createAndSetupElectronEnvironment>
  >;

  beforeAll(async () => {
    electronEnv = await globalThis.createAndSetupElectronEnvironment();
    testingContext = await globalThis.createElectronTestingContext(electronEnv);
    await testingContext.page.goto(liveGoogleMapsQueryUrl, {
      waitUntil: "domcontentloaded",
    });
  });

  afterAll(async () => {
    await globalThis.teardownTestRuntime({
      testingContext: testingContext,
      electronEnvironment: electronEnv,
    });
  });

  itFullLiveGoogleMaps(
    "scrolls the live Google Maps results feed and enqueues real place URLs",
    async () => {
      const resultsFeedHandle = await findGoogleMapsResultsFeed(
        testingContext.page,
      );

      await resultsFeedHandle.evaluate((feed) => {
        const htmlFeed = feed as HTMLElement;

        htmlFeed.setAttribute("data-test-results-feed", "true");

        const existingStopSignal = htmlFeed.querySelector(
          '[data-test-stop-signal="true"]',
        );

        if (existingStopSignal) {
          return;
        }

        const spacer = document.createElement("div");
        spacer.setAttribute("data-test-scroll-spacer", "true");
        spacer.style.height = "1400px";

        const stopSignal = document.createElement("div");
        stopSignal.setAttribute("data-test-stop-signal", "true");
        stopSignal.textContent = "Test stop signal";
        stopSignal.style.height = "24px";

        htmlFeed.append(spacer, stopSignal);
      });

      const urlQueue = new ObservedQueue<string>();
      const callback = jest.fn();
      const useCase = new CollectPlaceUrlUseCase(
        globalThis.createLogger(),
        new PuppeteerPageHandle(testingContext.page),
        urlQueue,
      );

      const executionPromise = useCase.execute(
        '[data-test-results-feed="true"]',
        'div[role="article"]',
        'a[href*="/maps/place/"][aria-label]',
        '[data-test-stop-signal="true"]',
        { pixel: 450, settleDelayMs: 750 },
        callback,
      );

      await waitForCondition(
        () => urlQueue.length > 0,
        "CollectPlaceUrlUseCase to enqueue at least one live URL",
      );
      await executionPromise;

      const collectedUrls = drainQueue(urlQueue);
      const panelScrollTop = await testingContext.page.$eval(
        '[data-test-results-feed="true"]',
        (element) => (element as HTMLElement).scrollTop,
      );

      expect(collectedUrls.length).toBeGreaterThan(0);
        expect(collectedUrls.every((url) => url.includes("/maps/place/"))).toBe(
        true,
      );
      expect(callback).toHaveBeenCalledTimes(1);
    },
  );
});



