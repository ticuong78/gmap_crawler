import { IDetector } from "../../contracts/IDetector";

export interface IPanelDetector extends IDetector<string, Promise<boolean>> {}
