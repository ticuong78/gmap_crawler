import { IDetector } from "../../../domain/interfaces/IDetector";
import { PlaceInfoTarget } from "../../entities/PlaceInfo/PlaceInfoTarget";

export interface IPlaceInfoDetector extends IDetector<
  PlaceInfoTarget,
  boolean
> {
  detect(target: PlaceInfoTarget): boolean;
}
