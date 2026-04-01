import { ICrawler } from "../../contracts/ICrawler";
import { PlaceInfo } from "../../../0_domain/entities/PlaceInfo";
import { IPlaceHandle } from "../../types/PlaceTypes/IPlaceHandle";

export interface IPlaceCrawler extends ICrawler<
  IPlaceHandle,
  Promise<PlaceInfo>
> {}
