import { Page } from "puppeteer-core";
import { IElementHandle } from "../../1_application/ports/IElementHandle";
import { PuppeteerElementHandle } from "./PuppeteerElementHandle";
import { IPageHandle } from "../../1_application/ports/IPageHandle";

export class PuppeteerPageHandle implements IPageHandle {
  constructor(private readonly page: Page) {}

  async find(selector: string): Promise<IElementHandle> {
    const el = await this.page.$(selector);
    if (!el) throw new Error(`Not found: ${selector}`);
    return new PuppeteerElementHandle(el);
  }

  async goto(url: string): Promise<boolean> {
    try {
      await this.page.goto(url);

      return true;
    } catch {
      return false;
    }
  }

  async findAll(selector: string): Promise<IElementHandle[]> {
    const els = await this.page.$$(selector);
    return els.map((el) => new PuppeteerElementHandle(el));
  }
}
