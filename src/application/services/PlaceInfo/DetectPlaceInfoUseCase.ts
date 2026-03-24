import { PlaceInfoTarget } from "../../entities/PlaceInfo/PlaceInfoTarget";
import { AbstractLogger } from "../../ports/Logger/AbstractLogger";
import { IPlaceInfoDetector } from "../../ports/PlaceInfo/IPlaceInfoDetector";

export class DetectPlaceInfoUseCase {
  constructor(
    private readonly _logger: AbstractLogger,
    private readonly _placeInfoDetector: IPlaceInfoDetector,
  ) {}

  collect(target: PlaceInfoTarget): boolean {
    // yield this._placeInfoDetector.detect(target);
    // log if keep finding

    return false;
  }
}
