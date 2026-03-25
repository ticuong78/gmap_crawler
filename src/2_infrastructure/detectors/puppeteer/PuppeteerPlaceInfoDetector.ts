import { ElementHandle, Page } from "puppeteer-core";
import { IPlaceInfoDetector } from "../../../1_application/ports/PlaceInfo/IPlaceInfoDetector";
import { PlaceInfoTarget } from "../../../1_application/types/PlaceInfo/PlaceInfoTarget";

export type ScopeContext =
  | { type: "page"; value: Page }
  | { type: "element"; value: ElementHandle<Element> };

export class PuppeteerPlaceInfoDetector implements IPlaceInfoDetector {
  constructor(private readonly _scopeContext: ScopeContext) {}

  async detect(target: PlaceInfoTarget): Promise<boolean> {
    if (this._scopeContext.type == "page")
      return await this._detectFromPage(target, this._scopeContext.value);
    else return await this._detectFromElement(target, this._scopeContext.value);
  }

  private async _detectFromPage(
    target: PlaceInfoTarget,
    page: Page,
  ): Promise<boolean> {
    /* 
    return true if at least one element of the selected target is found from the specified page
    */
    const placeInfoElementHandle = await page.$(target.selector);

    return !!placeInfoElementHandle;
  }

  private async _detectFromElement(
    target: PlaceInfoTarget,
    elementHandle: ElementHandle<Element>,
  ): Promise<boolean> {
    /* 
    return true if at least one element of the selected target is found from the specified handle
    */

    /**
     *
     * Kịch bản test
     */

    const placeInfoElementHandle = await elementHandle.$(target.selector);

    return !!placeInfoElementHandle;
  }
}
