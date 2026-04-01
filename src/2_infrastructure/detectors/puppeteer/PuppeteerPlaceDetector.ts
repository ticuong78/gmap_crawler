import { ElementHandle, Page } from "puppeteer-core";
import { PuppeteerPlaceHandle } from "./PuppteerPlaceHandle";
import { IPlaceDetector } from "../../../1_application/ports/Place/IPlaceDetector";
import { AbstractDetector } from "../../concretes/AbstractDetector";
import { DetectorOptions } from "../../options/DetectorOptions";

export type ScopeContext =
  | { type: "page"; value: Page }
  | { type: "element"; value: ElementHandle<Element> };

export class PuppeteerPlaceDetector
  extends AbstractDetector
  implements IPlaceDetector
{
  constructor(
    private readonly _scopeContext: ScopeContext,
    protected readonly _options?: DetectorOptions,
  ) {
    super(_options);
  }

  async detect(selector: string): Promise<PuppeteerPlaceHandle[]> {
    if (this._scopeContext.type == "page")
      return await this._detectFromPage(selector, this._scopeContext.value);
    else
      return await this._detectFromElement(selector, this._scopeContext.value);
  }

  private async _detectFromPage(
    selector: string,
    page: Page,
  ): Promise<PuppeteerPlaceHandle[]> {
    /* 
    return true if at least one element of the selected target is found from the specified page
    */
    const placeInfoElementHandle = await page.$$(selector);

    return placeInfoElementHandle.map((item) => new PuppeteerPlaceHandle(item));
  }

  private async _detectFromElement(
    selector: string,
    elementHandle: ElementHandle<Element>,
  ): Promise<PuppeteerPlaceHandle[]> {
    /* 
    return true if at least one element of the selected target is found from the specified handle
    */

    /**
     *
     * Kịch bản test
     */

    const placeInfoElementHandle = await elementHandle.$$(selector);

    return placeInfoElementHandle.map((item) => new PuppeteerPlaceHandle(item));
  }
}
