import { PlaceInfo } from "../../../domain/entities/PlaceInfo";
import { PlaceInfoTarget } from "../../entities/PlaceInfo/PlaceInfoTarget";
import { AbstractLogger } from "../../ports/Logger/AbstractLogger";
import { IPlaceInfoCrawler } from "../../ports/PlaceInfo/IPlaceInfoCrawler";

export class CollectPlaceInfoUseCase {
  constructor(
    private readonly _logger: AbstractLogger,
    private readonly _placeInfoCrawler: IPlaceInfoCrawler,
  ) {}

  async collect(target: PlaceInfoTarget): Promise<PlaceInfo> {
    return await this._placeInfoCrawler.crawl(target);
  }
}
