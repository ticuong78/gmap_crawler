import { ClickExecutionOptions } from "../options/ClickExecutionOptions";

export interface IClicker<TTarget = void, TResult = boolean> {
  click(target: TTarget, options?: ClickExecutionOptions): TResult;
}
