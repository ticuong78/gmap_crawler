import { PlaceInfo } from "../../../0_domain/entities/PlaceInfo";
import { AbstractLogger } from "../../ports/Logger/AbstractLogger";
import { IPlaceInfoCrawler } from "../../ports/PlaceInfo/IPlaceInfoCrawler";
import { PlaceInfoTarget } from "../../types/PlaceInfo/PlaceInfoTarget";

export class CollectPlaceInfoUseCase {
  constructor(
    private readonly _logger: AbstractLogger,
    private readonly _placeInfoCrawler: IPlaceInfoCrawler,
  ) {}

  async collect(target: PlaceInfoTarget): Promise<PlaceInfo> {
    return await this._placeInfoCrawler.crawl(target);
  }
}
