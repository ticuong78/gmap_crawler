import { Queue } from "../data_structure/Queue";
import { ScrollExecutionOptions } from "../options/ScrollExecutionOptions";
import { IElementHandle } from "../ports/IElementHandle";
import { ILogger } from "../ports/ILogger";
import { IPageHandle } from "../ports/IPageHandle";

// export type CollectPlaceInfoExecutionOptions = {
//   click?: ClickElementExecutionOptions;
//   find?: LookUpElementExecutionOptions;
// };

// steps:
// 1. boot up the page
// 2. Collect URL from the opened page
// 3. Scrape information from those pages

export class CollectPlaceUrlUseCase {
  constructor(
    private readonly _logger: ILogger,
    private readonly _pageHandle: IPageHandle,
    private readonly _urlQueue: Queue<string>,
  ) {}

  private async searchForManyElements(
    rootElement: {
      findAll: (selector: string) => Promise<IElementHandle[]>;
    },
    resultPanelSelector: string,
  ): Promise<IElementHandle[]> {
    // goto before access this function
    const resultPanelHandle = await rootElement.findAll(resultPanelSelector);

    return resultPanelHandle;
  }

  private async searchForElement(
    rootElement: {
      find: (selector: string) => Promise<IElementHandle>;
    },
    resultPanelSelector: string,
  ): Promise<IElementHandle> {
    // goto before access this function
    const resultPanelHandle = await rootElement.find(resultPanelSelector);

    return resultPanelHandle;
  }

  private async waitAfterScroll(settleDelayMs?: number): Promise<void> {
    if (!settleDelayMs || settleDelayMs <= 0) return;

    await new Promise((resolve) => setTimeout(resolve, settleDelayMs));
  }

  async execute(
    resultPanelSelector: string,
    placeCardSelector: string,
    placeUrlSecltor: string, // xpath///a[@aria-label and @href*="maps/place"]
    stopSignalSelector: string, // Bạn đã xem hết danh sách này.
    scrollOptions: ScrollExecutionOptions = {
      pixel: 1000,
    },
    callback: Function,
  ): Promise<void> {
    const resultPanelHandle = await this.searchForElement(
      // only one panel
      this._pageHandle,
      resultPanelSelector,
    );

    while (true) {
      const placeHandles: IElementHandle[] = await this.searchForManyElements(
        resultPanelHandle,
        placeCardSelector,
      );

      await Promise.all(
        placeHandles.map(async (handle) => {
          const anchor = await this.searchForElement(handle, placeUrlSecltor);
          const url = await anchor.getAttribute("href");

          this._urlQueue.enqueue(url);
        }),
      );

      const stopSignalHandle = await this.searchForElement(
        resultPanelHandle,
        stopSignalSelector,
      );

      if (stopSignalHandle && (await stopSignalHandle.isIntersectingViewport()))
        break;

      await resultPanelHandle.scroll(scrollOptions);
      await this.waitAfterScroll(scrollOptions.settleDelayMs);
    }

    callback();
  }
}
