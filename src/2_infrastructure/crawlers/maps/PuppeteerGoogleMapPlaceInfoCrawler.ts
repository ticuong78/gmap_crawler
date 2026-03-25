import { PlaceInfo } from "../../../0_domain/entities/PlaceInfo";
import { IPlaceInfoCrawler } from "../../../1_application/ports/PlaceInfo/IPlaceInfoCrawler";
import { PlaceInfoTarget } from "../../../1_application/types/PlaceInfo/PlaceInfoTarget";

export class PuppeteerGoogleMapPlaceInfoCrawler implements IPlaceInfoCrawler {
  crawl(target: PlaceInfoTarget): Promise<PlaceInfo> {
    throw new Error("Method not implemented.");
  }
}
