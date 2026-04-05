import * as puppeteer from "puppeteer-core";
import { existsSync } from "fs";
import { ElectronEnvironment } from "@tests/integration/support/electron-environment";

export type TestingContext = {
  browser: puppeteer.Browser;
  page: puppeteer.Page;

  teardown: () => Promise<boolean>;
};

const CONNECTION_RETRY_DELAY_MS = 250;
const CONNECTION_RETRY_COUNT = 20;
const DEFAULT_ACCEPT_LANGUAGE =
  process.env.TEST_ACCEPT_LANGUAGE ?? "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7";
const NORMAL_BROWSER_EXECUTABLE_PATHS = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter((candidate): candidate is string => Boolean(candidate));

function resolvePuppeteerHeadlessMode(): boolean {
  const configuredValue = process.env.PUPPETEER_HEADLESS?.trim().toLowerCase();

  if (!configuredValue) return true;

  return !["0", "false", "no", "off"].includes(configuredValue);
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function configureTestingPage(page: puppeteer.Page): Promise<void> {
  await page.setExtraHTTPHeaders({
    "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
  });
}

function resolveNormalBrowserExecutablePath(): string {
  const executablePath = NORMAL_BROWSER_EXECUTABLE_PATHS.find((candidate) =>
    existsSync(candidate),
  );

  if (!executablePath) {
    throw new Error(
      "No supported browser executable found for createNormalTestingContext",
    );
  }

  return executablePath;
}

export async function tearDownTestingContext(
  browser: puppeteer.Browser,
  page: puppeteer.Page,
) {
  try {
    await page.close();
    await browser.close();
    await browser.disconnect();

    return true;
  } catch {
    return false;
  }
}

export async function createElectronTestingContext(
  environment: ElectronEnvironment,
): Promise<TestingContext> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= CONNECTION_RETRY_COUNT; attempt += 1) {
    try {
      const browser = await puppeteer.connect({
        browserURL: `http://127.0.0.1:${environment.getDebugPort()}`,
      });

      const pages = await browser.pages();
      const page = pages[0] ?? (await browser.newPage());

      await configureTestingPage(page);

      return {
        browser,
        page,
        teardown: () => tearDownTestingContext(browser, page),
      };
    } catch (error) {
      lastError = error;

      if (attempt < CONNECTION_RETRY_COUNT) {
        await delay(CONNECTION_RETRY_DELAY_MS);
      }
    }
  }

  throw lastError;
}

export async function createNormalTestingContext(): Promise<TestingContext> {
  const browser = await puppeteer.launch({
    executablePath: resolveNormalBrowserExecutablePath(),
    headless: resolvePuppeteerHeadlessMode(),
  });
  const page = await browser.newPage();

  await configureTestingPage(page);

  return {
    browser,
    page,
    teardown: () => tearDownTestingContext(browser, page),
  };
}
