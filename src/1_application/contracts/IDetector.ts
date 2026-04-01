import { DetectExecutionOptions } from "../options/DetectExecutionOptions";

export interface IDetector<TTarget = void, TResult = void> {
  detect(target: TTarget, options?: DetectExecutionOptions): TResult;
}
