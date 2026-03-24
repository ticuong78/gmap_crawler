import { IDetector } from "../../../domain/interfaces/IDetector";
import { SearchBarTarget } from "../../entities/SearchBar/SearchBarTarget";

export interface ISearchBarDetector extends IDetector<
  SearchBarTarget,
  boolean
> {
  detect(target: SearchBarTarget): boolean;
}
