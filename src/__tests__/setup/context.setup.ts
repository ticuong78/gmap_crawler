import * as puppeteer from "puppeteer-core";
import { ElectronEnvironment } from "./electron.setup";

export type TestingContext = {
  browser: puppeteer.Browser;
  page: puppeteer.Page;
};

const CONNECTION_RETRY_DELAY_MS = 250;
const CONNECTION_RETRY_COUNT = 20;

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createTestingContext(
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

      return { browser, page };
    } catch (error) {
      lastError = error;

      if (attempt < CONNECTION_RETRY_COUNT) {
        await delay(CONNECTION_RETRY_DELAY_MS);
      }
    }
  }

  throw lastError;
}
