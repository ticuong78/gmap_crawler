import { DetectExecutionOptions } from "../../../1_application/options/DetectExecutionOptions";
import { IPanelDetector } from "../../../1_application/ports/Panel/IPanelDetector";

export class PuppeteerPanelDetector implements IPanelDetector {
  detect(target: string, options?: DetectExecutionOptions): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
