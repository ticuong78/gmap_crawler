import type { ElementHandle, Page } from "puppeteer-core";

export const GOOGLE_MAPS_PLACE_LINK_SELECTOR =
  'div[role="article"] a[href*="/maps/place/"][aria-label]';

const GOOGLE_MAPS_RESULTS_FEED_SELECTOR = 'div[role="feed"]';
const DEFAULT_GOOGLE_MAPS_TIMEOUT_MS = 30000;

export async function waitForGoogleMapsPlaceLinks(
  page: Page,
  timeout: number = DEFAULT_GOOGLE_MAPS_TIMEOUT_MS,
): Promise<ElementHandle<Element>> {
  const placeLinkHandle = await page.waitForSelector(
    GOOGLE_MAPS_PLACE_LINK_SELECTOR,
    { timeout },
  );

  if (!placeLinkHandle) {
    throw new Error("Google Maps place links did not appear in time");
  }

  return placeLinkHandle;
}

export async function findGoogleMapsResultsFeed(
  page: Page,
  timeout: number = DEFAULT_GOOGLE_MAPS_TIMEOUT_MS,
): Promise<ElementHandle<Element>> {
  await waitForGoogleMapsPlaceLinks(page, timeout);

  const resultsFeedHandle = await page.evaluateHandle((placeLinkSelector) => {
    const feeds = Array.from(
      document.querySelectorAll<HTMLElement>('div[role="feed"]'),
    );

    return feeds.find((feed) => feed.querySelector(placeLinkSelector)) ?? null;
  }, GOOGLE_MAPS_PLACE_LINK_SELECTOR);

  const resultsFeedElement = resultsFeedHandle.asElement();

  if (!resultsFeedElement) {
    throw new Error(
      `Could not find ${GOOGLE_MAPS_RESULTS_FEED_SELECTOR} containing place links`,
    );
  }

  return resultsFeedElement as ElementHandle<Element>;
}
