import { IDetector } from "../../contracts/IDetector";
import { SearchBarTarget } from "../../types/SearchBar/SearchBarTarget";

export interface ISearchBarDetector extends IDetector<
  SearchBarTarget,
  boolean
> {
  detect(target: SearchBarTarget): boolean;
}
