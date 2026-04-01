import { ElementHandle, Page } from "puppeteer-core";

import { PuppeteerPlaceDetector } from "../2_infrastructure/detectors/puppeteer/PuppeteerPlaceDetector";
import { PuppeteerPlaceHandle } from "../2_infrastructure/detectors/puppeteer/PuppteerPlaceHandle";

declare const page: Page; // inject bởi jest-environment-puppeteer

describe("PuppeteerPlaceDetector — integration: page scope", () => {
  it("should detect elements matching selector", async () => {
    await page.setContent(`
      <div class="place-card">Hội An</div>
      <div class="place-card">Mỹ Sơn</div>
    `);

    const detector = new PuppeteerPlaceDetector({ type: "page", value: page });
    const result = await detector.detect(".place-card");

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(PuppeteerPlaceHandle);
  });

  it("should return empty array when selector matches nothing", async () => {
    await page.setContent(`<div class="other">không có gì</div>`);

    const detector = new PuppeteerPlaceDetector({ type: "page", value: page });
    const result = await detector.detect(".place-card");

    expect(result).toHaveLength(0);
  });
});

describe("PuppeteerPlaceDetector — integration: element scope", () => {
  it("should detect elements within a container element", async () => {
    await page.setContent(`
      <div class="container">
        <div class="place-card">Đà Nẵng</div>
        <div class="place-card">Hue</div>
      </div>
    `);

    const container = (await page.$(".container")) as ElementHandle<Element>;
    const detector = new PuppeteerPlaceDetector({
      type: "element",
      value: container,
    });
    const result = await detector.detect(".place-card");

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(PuppeteerPlaceHandle);
  });

  it("should not detect elements outside the container", async () => {
    await page.setContent(`
      <div class="place-card">Ngoài container</div>
      <div class="container">
        <div class="place-card">Trong container</div>
      </div>
    `);

    const container = (await page.$(".container")) as ElementHandle<Element>;
    const detector = new PuppeteerPlaceDetector({
      type: "element",
      value: container,
    });
    const result = await detector.detect(".place-card");

    // Chỉ tìm thấy 1 — cái nằm trong container
    expect(result).toHaveLength(1);
  });
});
