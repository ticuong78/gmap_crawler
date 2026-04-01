import { ClickerOptions } from "../options/ClickerOptions";

export abstract class AbstractClicker {
  constructor(protected readonly _options?: ClickerOptions) {}
}
