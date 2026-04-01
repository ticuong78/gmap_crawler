import { PlaceInfo } from "../../../0_domain/entities/PlaceInfo";
import { CrawlExecutionOptions } from "../../../1_application/options/CrawlExecutionOptions";
import { IPlaceCrawler } from "../../../1_application/ports/Place/IPlaceCrawler";
import { IPlaceHandle } from "../../../1_application/types/PlaceTypes/IPlaceHandle";

export class PuppeteerPlaceCrawler implements IPlaceCrawler {
  crawl(
    target: IPlaceHandle,
    options?: CrawlExecutionOptions,
  ): Promise<PlaceInfo> {
    throw new Error("Method not implemented.");
  }
}
