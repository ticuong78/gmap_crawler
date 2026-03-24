import { PlaceInfoCrawler } from "../../../application/ports/PlaceInfoCrawler";
import { PlaceInfoTarget } from "../../../application/services/CollectPlaceInfoUseCase";
import { PlaceInfo } from "../../../domain/entities/PlaceInfo";

export class PuppeteerGoogleMapPlaceInfoCrawler implements PlaceInfoCrawler {
  crawl(target: PlaceInfoTarget): Promise<PlaceInfo> {
    throw new Error("Method not implemented.");
  }
}
