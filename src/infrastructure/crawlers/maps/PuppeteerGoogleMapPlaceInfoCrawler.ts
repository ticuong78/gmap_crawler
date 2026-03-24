import { PlaceInfoTarget } from "../../../application/entities/PlaceInfo/PlaceInfoTarget";
import { IPlaceInfoCrawler } from "../../../application/ports/PlaceInfo/IPlaceInfoCrawler";
import { PlaceInfo } from "../../../domain/entities/PlaceInfo";

export class PuppeteerGoogleMapPlaceInfoCrawler implements IPlaceInfoCrawler {
  crawl(target: PlaceInfoTarget): Promise<PlaceInfo> {
    throw new Error("Method not implemented.");
  }
}
