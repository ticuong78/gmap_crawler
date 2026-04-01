import { LogLevel } from "../enums/LogLevel";
import { ClickExecutionOptions } from "../options/ClickExecutionOptions";
import { CrawlExecutionOptions } from "../options/CrawlExecutionOptions";
import { DetectExecutionOptions } from "../options/DetectExecutionOptions";
import { ILogger } from "../ports/Logger/ILogger";
import { IPanelDetector } from "../ports/Panel/IPanelDetector";
import { IPlaceCrawler } from "../ports/Place/IPlaceCrawler";
import { IPlaceClicker } from "../ports/Place/IPlaceClicker";
import { IPlaceDetector } from "../ports/Place/IPlaceDetector";

export type CollectPlaceInfoExecutionOptions = {
  click?: ClickExecutionOptions;
  crawl?: CrawlExecutionOptions;
  placeDetect?: DetectExecutionOptions;
  panelDetect?: DetectExecutionOptions;
};

export class CollectPlaceInfoUseCase {
  constructor(
    private readonly _logger: ILogger,
    private readonly _placeDetector: IPlaceDetector,
    private readonly _panelDetector: IPanelDetector,
    private readonly _clicker: IPlaceClicker,
    private readonly _crawler: IPlaceCrawler,
  ) {}

  async execute(
    placeSelector: string,
    panelSelector: string,
    options?: CollectPlaceInfoExecutionOptions,
  ): Promise<void> {
    const handlers = await this._placeDetector.detect(
      placeSelector,
      options?.placeDetect,
    );

    for (const handler of handlers) {
      const clicked = await this._clicker.click(handler, options?.click);

      if (!clicked) {
        this._logger.log("Failed to click, skipping", LogLevel.Warn);
        continue;
      }

      const panelDetected = await this._panelDetector.detect(
        panelSelector,
        options?.panelDetect,
      );

      if (!panelDetected) {
        this._logger.log("Panel not detected, skipping crawl", LogLevel.Warn);
        continue;
      }

      await this._crawler.crawl(handler, options?.crawl);
    }
  }
}
