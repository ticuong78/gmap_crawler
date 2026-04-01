import { ILogger } from "../../ports/Logger/ILogger";
import { IPanelDetector } from "../../ports/Panel/IPanelDetector";
import { IPlaceClicker } from "../../ports/Place/IPlaceClicker";
import { IPlaceCrawler } from "../../ports/Place/IPlaceCrawler";
import { IPlaceDetector } from "../../ports/Place/IPlaceDetector";
import { IPlaceHandle } from "../../types/PlaceTypes/IPlaceHandle";
import { CollectPlaceInfoUseCase } from "../CollectPlaceInfoUseCase";

const makeFakeHandle = (): IPlaceHandle => ({}) as IPlaceHandle;

const makeLogger = (): ILogger => ({
  log: jest.fn(),
});

const makePlaceDetector = (handles: IPlaceHandle[]): IPlaceDetector => ({
  detect: jest.fn().mockResolvedValue(handles),
});

const makePanelDetector = (detected: boolean): IPanelDetector => ({
  detect: jest.fn().mockResolvedValue(detected),
});

const makeClicker = (clicked: boolean): IPlaceClicker => ({
  click: jest.fn().mockResolvedValue(clicked),
});

const makeCrawler = (): IPlaceCrawler => ({
  crawl: jest.fn().mockResolvedValue(undefined),
});

const makeUseCase = (overrides: {
  handles?: IPlaceHandle[];
  clicked?: boolean;
  panelDetected?: boolean;
  logger?: ILogger;
  crawler?: IPlaceCrawler;
}) => {
  const logger = overrides.logger ?? makeLogger();
  const placeDetector = makePlaceDetector(overrides.handles ?? []);
  const panelDetector = makePanelDetector(overrides.panelDetected ?? true);
  const clicker = makeClicker(overrides.clicked ?? true);
  const crawler = overrides.crawler ?? makeCrawler();

  const useCase = new CollectPlaceInfoUseCase(
    logger,
    placeDetector,
    panelDetector,
    clicker,
    crawler,
  );

  return { useCase, logger, placeDetector, panelDetector, clicker, crawler };
};

describe("CollectPlaceInfoUseCase", () => {
  it("should do nothing when no place handles detected", async () => {
    const { useCase, clicker, crawler } = makeUseCase({ handles: [] });

    await useCase.execute(".place", ".panel");

    expect(clicker.click).not.toHaveBeenCalled();
    expect(crawler.crawl).not.toHaveBeenCalled();
  });

  it("should crawl when click and panel detection succeed", async () => {
    const handle = makeFakeHandle();
    const { useCase, crawler } = makeUseCase({
      handles: [handle],
      clicked: true,
      panelDetected: true,
    });

    await useCase.execute(".place", ".panel");

    expect(crawler.crawl).toHaveBeenCalledWith(handle, undefined);
  });

  it("should skip crawl and warn when click fails", async () => {
    const { useCase, logger, crawler } = makeUseCase({
      handles: [makeFakeHandle()],
      clicked: false,
    });

    await useCase.execute(".place", ".panel");

    expect(crawler.crawl).not.toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalledWith(
      "Failed to click, skipping",
      expect.anything(),
    );
  });

  it("should skip crawl and warn when panel not detected", async () => {
    const { useCase, logger, crawler } = makeUseCase({
      handles: [makeFakeHandle()],
      clicked: true,
      panelDetected: false,
    });

    await useCase.execute(".place", ".panel");

    expect(crawler.crawl).not.toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalledWith(
      "Panel not detected, skipping crawl",
      expect.anything(),
    );
  });

  it("should crawl each handle independently", async () => {
    const handles = [makeFakeHandle(), makeFakeHandle(), makeFakeHandle()];
    const { useCase, crawler } = makeUseCase({
      handles,
      clicked: true,
      panelDetected: true,
    });

    await useCase.execute(".place", ".panel");

    expect(crawler.crawl).toHaveBeenCalledTimes(3);
  });
});
