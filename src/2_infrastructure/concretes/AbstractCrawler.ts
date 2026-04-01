import { CrawlerOptions } from "../options/CrawlerOptions";

export abstract class AbstractCrawler {
  constructor(protected readonly _options?: CrawlerOptions) {}
}
