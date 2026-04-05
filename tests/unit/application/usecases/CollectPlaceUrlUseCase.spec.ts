import { Queue } from "@src/1_application/data_structure/Queue";
import { ScrollExecutionOptions } from "@src/1_application/options/ScrollExecutionOptions";
import { IElementHandle } from "@src/1_application/ports/IElementHandle";
import { ILogger } from "@src/1_application/ports/ILogger";
import { IPageHandle } from "@src/1_application/ports/IPageHandle";
import { CollectPlaceUrlUseCase } from "@src/1_application/usecases/CollectPlaceUrlUseCase";

function createDeferred<T>() {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((res) => {
    resolve = res;
  });

  return { promise, resolve };
}

function createElementHandleMock(): jest.Mocked<IElementHandle> {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    click: jest.fn(async function (this: IElementHandle) {
      return this;
    }),
    type: jest.fn(async function (this: IElementHandle) {
      return this;
    }),
    hover: jest.fn(async function (this: IElementHandle) {
      return this;
    }),
    scroll: jest.fn(async function (this: IElementHandle) {
      return this;
    }),
    getText: jest.fn(),
    getAttribute: jest.fn(),
    getHTML: jest.fn(),
    isVisible: jest.fn(),
    isIntersectingViewport: jest.fn(),
  } as unknown as jest.Mocked<IElementHandle>;
}

describe("CollectPlaceUrlUseCase", () => {
  const resultPanelSelector = '[role="feed"]';
  const placeCardSelector = '[role="article"]';
  const placeUrlSelector = 'a[href*="/maps/place/"]';
  const stopSignalSelector = '[data-stop="true"]';

  let logger: ILogger;
  let pageHandle: jest.Mocked<IPageHandle>;
  let urlQueue: Queue<string>;

  beforeEach(() => {
    logger = {
      log: jest.fn(),
    };
    pageHandle = {
      find: jest.fn(),
      findAll: jest.fn(),
    };
    urlQueue = new Queue<string>();
  });

  describe("execute()", () => {
    it("collects discovered place URLs before invoking the callback", async () => {
      const resultPanelHandle = createElementHandleMock();
      const placeHandleA = createElementHandleMock();
      const placeHandleB = createElementHandleMock();
      const anchorHandleA = createElementHandleMock();
      const anchorHandleB = createElementHandleMock();
      const stopSignalHandle = createElementHandleMock();
      const callback = jest.fn();
      const hrefA = createDeferred<string>();

      pageHandle.find.mockImplementation(async (selector) => {
        expect(selector).toBe(resultPanelSelector);
        return resultPanelHandle;
      });
      resultPanelHandle.findAll.mockImplementation(async (selector) => {
        expect(selector).toBe(placeCardSelector);
        return [placeHandleA, placeHandleB];
      });
      placeHandleA.find.mockImplementation(async (selector) => {
        expect(selector).toBe(placeUrlSelector);
        return anchorHandleA;
      });
      placeHandleB.find.mockImplementation(async (selector) => {
        expect(selector).toBe(placeUrlSelector);
        return anchorHandleB;
      });
      resultPanelHandle.find.mockImplementation(async (selector) => {
        expect(selector).toBe(stopSignalSelector);
        return stopSignalHandle;
      });
      anchorHandleA.getAttribute.mockReturnValue(hrefA.promise);
      anchorHandleB.getAttribute.mockResolvedValue("https://maps.google.com/place/b");
      stopSignalHandle.isIntersectingViewport.mockResolvedValue(true);

      const useCase = new CollectPlaceUrlUseCase(logger, pageHandle, urlQueue);
      const executePromise = useCase.execute(
        resultPanelSelector,
        placeCardSelector,
        placeUrlSelector,
        stopSignalSelector,
        { pixel: 400 },
        callback,
      );

      await Promise.resolve();
      await Promise.resolve();

      expect(callback).not.toHaveBeenCalled();
      expect(urlQueue.isEmpty).toBe(true);

      hrefA.resolve("https://maps.google.com/place/a");
      await executePromise;

      expect(urlQueue.length).toBe(2);
      const collectedUrls = [urlQueue.dequeue(), urlQueue.dequeue()].sort();

      expect(collectedUrls).toStrictEqual([
        "https://maps.google.com/place/a",
        "https://maps.google.com/place/b",
      ]);
      expect(resultPanelHandle.scroll).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("scrolls the result panel until the stop signal becomes visible", async () => {
      const resultPanelHandle = createElementHandleMock();
      const stopSignalHandle = createElementHandleMock();
      const callback = jest.fn();
      const scrollOptions: ScrollExecutionOptions = {
        pixel: 250,
      };

      pageHandle.find.mockResolvedValue(resultPanelHandle);
      resultPanelHandle.findAll
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      resultPanelHandle.find.mockResolvedValue(stopSignalHandle);
      stopSignalHandle.isIntersectingViewport
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const useCase = new CollectPlaceUrlUseCase(logger, pageHandle, urlQueue);

      await useCase.execute(
        resultPanelSelector,
        placeCardSelector,
        placeUrlSelector,
        stopSignalSelector,
        scrollOptions,
        callback,
      );

      expect(pageHandle.find).toHaveBeenCalledTimes(1);
      expect(resultPanelHandle.findAll).toHaveBeenCalledTimes(2);
      expect(resultPanelHandle.find).toHaveBeenCalledTimes(2);
      expect(resultPanelHandle.scroll).toHaveBeenCalledTimes(1);
      expect(resultPanelHandle.scroll).toHaveBeenCalledWith(scrollOptions);
      expect(urlQueue.isEmpty).toBe(true);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});

