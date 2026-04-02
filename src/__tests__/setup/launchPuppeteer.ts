import puppeteer, { type LaunchOptions } from "puppeteer-core";

// for instance, url could be `https://www.google.com/maps/search/kaiserin`

export async function createTestContext(url: string, options?: LaunchOptions) {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  await page.goto(url);
  await page.waitForNetworkIdle({
    idleTime: 5000,
  });

  return { browser, page };
}
