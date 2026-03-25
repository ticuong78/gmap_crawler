import { ICrawler } from "../../contracts/ICrawler";
import { PlaceInfo } from "../../../0_domain/entities/PlaceInfo";
import { PlaceInfoTarget } from "../../types/PlaceInfo/PlaceInfoTarget";

export interface IPlaceInfoCrawler extends ICrawler<
  PlaceInfoTarget,
  Promise<PlaceInfo>
> {
  crawl(target: PlaceInfoTarget): Promise<PlaceInfo>;
}
