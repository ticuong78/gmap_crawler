import { PlaceInfo } from "../../domain/entities/PlaceInfo";
import { AbstractLogger } from "../ports/AbstractLogger";
import { PlaceInfoCrawler } from "../ports/PlaceInfoCrawler";

export type PlaceInfoTarget = {
  itemRef: string;
};

export abstract class CollectPlaceInfoUseCase {
  private readonly _logger: AbstractLogger;
  private readonly _placeInfoCrawler: PlaceInfoCrawler;

  constructor(placeInfoCrawler: PlaceInfoCrawler, logger: AbstractLogger) {
    this._logger = logger;
    this._placeInfoCrawler = placeInfoCrawler;
  }

  async collect(target: PlaceInfoTarget): Promise<PlaceInfo> {
    return await this._placeInfoCrawler.crawl(target);
  }
}
