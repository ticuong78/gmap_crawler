import { AbstractLogger } from "../../ports/Logger/AbstractLogger";
import { IPlaceInfoDetector } from "../../ports/PlaceInfo/IPlaceInfoDetector";
import { PlaceInfoTarget } from "../../types/PlaceInfo/PlaceInfoTarget";

export class DetectPlaceInfoUseCase {
  constructor(
    private readonly _logger: AbstractLogger,
    private readonly _placeInfoDetector: IPlaceInfoDetector,
  ) {}

  async detect(target: PlaceInfoTarget): Promise<boolean> {
    // yield this._placeInfoDetector.detect(target);
    // log if keep finding

    return await this._placeInfoDetector.detect(target);
  }
}
