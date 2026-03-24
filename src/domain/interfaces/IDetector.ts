export interface IDetector<TTarget = void, TResult = boolean> {
  detect(target: TTarget): TResult;
}
