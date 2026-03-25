import { ISearchBarDetector } from "../../../1_application/ports/SearchBar/ISearchBarDectector";
import { SearchBarTarget } from "../../../1_application/types/SearchBar/SearchBarTarget";

export class PuppeteerSearchBarDetector implements ISearchBarDetector {
  detect(target: SearchBarTarget): boolean {
    throw new Error("Method not implemented.");
  }
}
