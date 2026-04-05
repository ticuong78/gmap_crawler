import { ElementHandle } from "puppeteer-core";
import { IElementHandle } from "../../1_application/ports/IElementHandle";
import { ScrollExecutionOptions } from "../../1_application/options/ScrollExecutionOptions";

export class PuppeteerElementHandle implements IElementHandle {
  constructor(private readonly handle: ElementHandle) {}

  async find(selector: string): Promise<IElementHandle> {
    const el = await this.handle.$(selector);
    if (!el) throw new Error(`Not found: ${selector}`);
    return new PuppeteerElementHandle(el);
  }

  async findAll(selector: string): Promise<IElementHandle[]> {
    const els = await this.handle.$$(selector);
    return els.map((el) => new PuppeteerElementHandle(el));
  }

  async isVisible(): Promise<boolean> {
    return this.handle.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        rect.width > 0 &&
        rect.height > 0
      );
    });
  }

  isIntersectingViewport(): Promise<boolean> {
    return this.handle.isIntersectingViewport();
  }

  async scroll(options: ScrollExecutionOptions): Promise<this> {
    const canScroll = await this.handle.evaluate((el) => {
      const overflowY = window.getComputedStyle(el).overflowY;
      const supportsVerticalScroll = ["auto", "scroll", "overlay"].includes(
        overflowY,
      );

      return el.scrollHeight > el.clientHeight && supportsVerticalScroll;
    });

    if (!canScroll) {
      throw new Error("Element is not vertically scrollable");
    }

    await this.handle.evaluate((el, px) => {
      el.scrollTop += px;
    }, options.pixel);

    return this;
  }

  async click(): Promise<this> {
    await this.handle.click();
    return this;
  }

  async type(text: string): Promise<this> {
    await this.handle.type(text);
    return this;
  }

  async hover(): Promise<this> {
    await this.handle.hover();
    return this;
  }

  async getText(): Promise<string> {
    return this.handle.evaluate((el) => el.textContent ?? "");
  }

  async getAttribute(name: string): Promise<string> {
    return this.handle.evaluate((el, n) => el.getAttribute(n) ?? "", name);
  }

  async getHTML(): Promise<string> {
    return this.handle.evaluate((el) => el.outerHTML);
  }
}
