import { PlaceInfo } from "../../../domain/entities/PlaceInfo";
import { ICrawler } from "../../../domain/interfaces/ICrawler";
import { PlaceInfoTarget } from "../../entities/PlaceInfo/PlaceInfoTarget";

export interface IPlaceInfoCrawler extends ICrawler<
  PlaceInfoTarget,
  Promise<PlaceInfo>
> {
  crawl(target: PlaceInfoTarget): Promise<PlaceInfo>;
}
