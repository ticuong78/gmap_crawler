import { CrawlExecutionOptions } from "../options/CrawlExecutionOptions";

export interface ICrawler<TTarget = void, TResult = boolean> {
  crawl(target: TTarget, options?: CrawlExecutionOptions): TResult;
}
