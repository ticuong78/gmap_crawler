import { DetectorOptions } from "../options/DetectorOptions";

export abstract class AbstractDetector {
  constructor(protected readonly _options?: DetectorOptions) {}
}
