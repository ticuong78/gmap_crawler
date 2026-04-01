import { IClicker } from "../../contracts/IClicker";
import { IPlaceHandle } from "../../types/PlaceTypes/IPlaceHandle";

export interface IPlaceClicker extends IClicker<
  IPlaceHandle,
  Promise<boolean>
> {}
