import { ClickExecutionOptions } from "../../../1_application/options/ClickExecutionOptions";
import { IPlaceClicker } from "../../../1_application/ports/Place/IPlaceClicker";
import { IPlaceHandle } from "../../../1_application/types/PlaceTypes/IPlaceHandle";

export class PuppeteerPlaceClicker implements IPlaceClicker {
  click(
    target: IPlaceHandle,
    options?: ClickExecutionOptions,
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
