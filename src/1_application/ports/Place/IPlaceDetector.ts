import { IDetector } from "../../contracts/IDetector";
import { IPlaceHandle } from "../../types/PlaceTypes/IPlaceHandle";

export interface IPlaceDetector extends IDetector<
  string,
  Promise<IPlaceHandle[]>
> {}
