import { Page, ElementHandle } from "puppeteer-core";

import { PuppeteerPlaceDetector } from "../PuppeteerPlaceDetector";
import { PuppeteerPlaceHandle } from "../PuppteerPlaceHandle";

function makeFakePage(handles: object[]): Page {
  return {
    $$: jest.fn().mockResolvedValue(handles),
  } as unknown as Page;
}

function makeFakeElementHandle(handles: object[]): ElementHandle<Element> {
  return {
    $$: jest.fn().mockResolvedValue(handles),
  } as unknown as ElementHandle<Element>;
}

const fakeRawHandle = {} as ElementHandle<Element>;

describe("PuppeteerPlaceDetector — scope: page", () => {
  it("should call page.$$ with correct selector", async () => {
    const page = makeFakePage([fakeRawHandle]);
    const detector = new PuppeteerPlaceDetector({ type: "page", value: page });

    await detector.detect(".place-card");

    expect(page.$$).toHaveBeenCalledWith(".place-card");
  });

  it("should return PuppeteerPlaceHandle[] mapped from page.$$", async () => {
    const page = makeFakePage([fakeRawHandle, fakeRawHandle]);
    const detector = new PuppeteerPlaceDetector({ type: "page", value: page });

    const result = await detector.detect(".place-card");

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(PuppeteerPlaceHandle);
  });

  it("should return empty array when nothing found", async () => {
    const page = makeFakePage([]);
    const detector = new PuppeteerPlaceDetector({ type: "page", value: page });

    const result = await detector.detect(".place-card");

    expect(result).toHaveLength(0);
  });
});

describe("PuppeteerPlaceDetector — scope: element", () => {
  it("should call element.$$ with correct selector", async () => {
    const element = makeFakeElementHandle([fakeRawHandle]);
    const detector = new PuppeteerPlaceDetector({
      type: "element",
      value: element,
    });

    await detector.detect(".place-card");

    expect(element.$$).toHaveBeenCalledWith(".place-card");
  });

  it("should return PuppeteerPlaceHandle[] mapped from element.$$", async () => {
    const element = makeFakeElementHandle([fakeRawHandle, fakeRawHandle]);
    const detector = new PuppeteerPlaceDetector({
      type: "element",
      value: element,
    });

    const result = await detector.detect(".place-card");

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(PuppeteerPlaceHandle);
  });

  it("should return empty array when nothing found", async () => {
    const element = makeFakeElementHandle([]);
    const detector = new PuppeteerPlaceDetector({
      type: "element",
      value: element,
    });

    const result = await detector.detect(".place-card");

    expect(result).toHaveLength(0);
  });
});
