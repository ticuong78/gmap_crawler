import { PlaceInfo } from "../../domain/entities/PlaceInfo";
import { PlaceInfoTarget } from "../services/CollectPlaceInfoUseCase";

export interface PlaceInfoCrawler {
  crawl(target: PlaceInfoTarget): Promise<PlaceInfo>;
}
