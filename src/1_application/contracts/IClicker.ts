export interface IClicker<TTarget = void, TResult = boolean> {
  click(target: TTarget): TResult;
}
