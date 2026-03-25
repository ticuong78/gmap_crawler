export interface ICrawler<TTarget = void, TResult = boolean> {
  crawl(target: TTarget): TResult;
}
