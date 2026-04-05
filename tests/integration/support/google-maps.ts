import { mkdir, writeFile } from "fs/promises";
import path from "path";
import type { ElementHandle, Page } from "puppeteer-core";

export const GOOGLE_MAPS_PLACE_LINK_SELECTOR =
  'div[role="article"] a[href*="/maps/place/"][aria-label]';

const GOOGLE_MAPS_RESULTS_FEED_SELECTOR = 'div[role="feed"]';
const DEFAULT_GOOGLE_MAPS_TIMEOUT_MS = 30000;

type GoogleMapsDebugState = {
  articleCount: number;
  bodyTextSnippet: string;
  consentButtons: string[];
  hasSearchInput: boolean;
  placeLinkCount: number;
  resultsFeedCount: number;
  title: string;
  url: string;
};

function sanitizeFileSegment(value: string): string {
  return value.replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-").toLowerCase();
}

function formatGoogleMapsDebugState(state: GoogleMapsDebugState): string {
  const consentButtons = state.consentButtons.length
    ? ` consentButtons=${JSON.stringify(state.consentButtons)}`
    : "";

  return [
    `url=${state.url}`,
    `title=${JSON.stringify(state.title)}`,
    `resultsFeedCount=${state.resultsFeedCount}`,
    `articleCount=${state.articleCount}`,
    `placeLinkCount=${state.placeLinkCount}`,
    `hasSearchInput=${state.hasSearchInput}`,
    `bodyTextSnippet=${JSON.stringify(state.bodyTextSnippet)}`,
    consentButtons.trim(),
  ]
    .filter(Boolean)
    .join(" ");
}

async function collectGoogleMapsDebugState(
  page: Page,
): Promise<GoogleMapsDebugState> {
  const [title, state] = await Promise.all([
    page.title().catch(() => ""),
    page.evaluate((placeLinkSelector) => {
      const bodyText = document.body?.innerText ?? "";
      const candidateButtons = Array.from(
        document.querySelectorAll<HTMLButtonElement | HTMLInputElement>(
          'button, input[type="button"], input[type="submit"]',
        ),
      )
        .map((element) => {
          if (element instanceof HTMLInputElement) {
            return element.value.trim();
          }

          return (element.innerText || element.textContent || "").trim();
        })
        .filter(Boolean)
        .slice(0, 8);

      return {
        articleCount: document.querySelectorAll('div[role="article"]').length,
        bodyTextSnippet: bodyText.replace(/\s+/g, " ").trim().slice(0, 600),
        consentButtons: candidateButtons,
        hasSearchInput: Boolean(document.querySelector('input[role="combobox"]')),
        placeLinkCount: document.querySelectorAll(placeLinkSelector).length,
        resultsFeedCount: document.querySelectorAll('div[role="feed"]').length,
        url: window.location.href,
      };
    }, GOOGLE_MAPS_PLACE_LINK_SELECTOR),
  ]);

  return {
    ...state,
    title,
  };
}

async function persistGoogleMapsDebugArtifacts(
  page: Page,
  label: string,
  state: GoogleMapsDebugState,
): Promise<void> {
  const debugDir = process.env.GOOGLE_MAPS_DEBUG_DIR;

  if (!debugDir) return;

  await mkdir(debugDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[.:]/g, "-");
  const baseName = `${timestamp}-${sanitizeFileSegment(label)}`;
  const htmlPath = path.join(debugDir, `${baseName}.html`);
  const jsonPath = path.join(debugDir, `${baseName}.json`);
  const screenshotPath = path.join(debugDir, `${baseName}.png`);

  await Promise.all([
    page
      .content()
      .then((html) => writeFile(htmlPath, html, "utf8"))
      .catch(() => undefined),
    writeFile(jsonPath, JSON.stringify(state, null, 2), "utf8").catch(
      () => undefined,
    ),
    page.screenshot({ fullPage: true, path: screenshotPath }).catch(
      () => undefined,
    ),
  ]);
}

async function createGoogleMapsWaitError(
  page: Page,
  label: string,
  cause: unknown,
): Promise<Error> {
  const state = await collectGoogleMapsDebugState(page).catch(() => undefined);

  if (state) {
    await persistGoogleMapsDebugArtifacts(page, label, state);
  }

  const causeMessage = cause instanceof Error ? cause.message : String(cause);
  const debugMessage = state
    ? ` ${formatGoogleMapsDebugState(state)}`
    : "";

  return new Error(`${label}.${debugMessage} cause=${JSON.stringify(causeMessage)}`);
}

export async function waitForGoogleMapsPlaceLinks(
  page: Page,
  timeout: number = DEFAULT_GOOGLE_MAPS_TIMEOUT_MS,
): Promise<ElementHandle<Element>> {
  try {
    const placeLinkHandle = await page.waitForSelector(
      GOOGLE_MAPS_PLACE_LINK_SELECTOR,
      { timeout },
    );

    if (!placeLinkHandle) {
      throw new Error("Selector resolved to null handle");
    }

    return placeLinkHandle;
  } catch (error) {
    throw await createGoogleMapsWaitError(
      page,
      "Google Maps place links did not appear in time",
      error,
    );
  }
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
    throw await createGoogleMapsWaitError(
      page,
      `Could not find ${GOOGLE_MAPS_RESULTS_FEED_SELECTOR} containing place links`,
      new Error("Results feed handle resolved to null"),
    );
  }

  return resultsFeedElement as ElementHandle<Element>;
}
