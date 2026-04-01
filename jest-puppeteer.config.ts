import type { JestPuppeteerConfig } from "jest-environment-puppeteer";

const config: JestPuppeteerConfig = {
  launch: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
};

export default config;
