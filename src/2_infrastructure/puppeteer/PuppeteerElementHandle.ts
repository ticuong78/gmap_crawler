import { ElementHandle } from "puppeteer-core";
import { IElementHandle } from "../../1_application/ports/IElementHandle";

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
