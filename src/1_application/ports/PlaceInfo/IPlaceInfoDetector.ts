import { IDetector } from "../../contracts/IDetector";
import { PlaceInfoTarget } from "../../types/PlaceInfo/PlaceInfoTarget";

export interface IPlaceInfoDetector extends IDetector<
  PlaceInfoTarget,
  Promise<boolean>
> {
  detect(target: PlaceInfoTarget): Promise<boolean>;
}
