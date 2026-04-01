import { AutofillData, ElementHandle, Frame, Protocol } from "puppeteer-core";
import { IPlaceHandle } from "../../../1_application/types/PlaceTypes/IPlaceHandle";

export class PuppeteerPlaceHandle implements IPlaceHandle {
  constructor(private readonly _elementHandle: ElementHandle<Element>) {}

  async getText(selector: string): Promise<string> {
    return this._elementHandle.$eval(selector, (el) => el.textContent ?? "");
  }

  getAttribute(name: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  findAll(selector: string): Promise<IPlaceHandle[]> {
    throw new Error("Method not implemented.");
  }
}
