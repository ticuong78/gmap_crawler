import * as puppeteer from "puppeteer-core";
import { ElectronEnvironment } from "./electron.setup";

export type TestingContext = {
  browser: puppeteer.Browser;
  page: puppeteer.Page;
};

export async function createTestingContext(
  environment: ElectronEnvironment,
): Promise<TestingContext> {
  const browser = await puppeteer.connect({
    browserURL: `http://localhost:${environment.getDebugPort()}`,
  });

  const pages = await browser.pages();
  const page = pages[0] ?? (await browser.newPage());

  return { browser, page };
}
