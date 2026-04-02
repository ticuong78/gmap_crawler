import { LogLevel } from "../enums/LogLevel";
import { ClickElementExecutionOptions } from "../options/ClickElementExecutionOptions";
import { LookUpElementExecutionOptions } from "../options/LookUpElementExecutionOptions";
import { IElementHandle } from "../ports/IElementHandle";
import { ILogger } from "../ports/ILogger";

// export type CollectPlaceInfoExecutionOptions = {
//   click?: ClickElementExecutionOptions;
//   find?: LookUpElementExecutionOptions;
// };

export class CollectPlaceInfoUseCase {
  constructor(
    private readonly _logger: ILogger,
    private readonly _elementHandle: IElementHandle,
  ) {}

  async execute(
    placeSelector: string,
    panelSelector: string,
    // options?: CollectPlaceInfoExecutionOptions,
  ): Promise<void> {}
}
