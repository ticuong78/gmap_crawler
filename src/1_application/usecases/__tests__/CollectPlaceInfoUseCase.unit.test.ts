import { IElementHandle } from "../../ports/IElementHandle";
import { ILogger } from "../../ports/ILogger";
import { IPageHandle } from "../../ports/IPageHandle";

const mockPageHandle: IPageHandle = {
  find: jest.fn(),
  findAll: jest.fn(),
};

describe("CollectPlaceInfoUseCase - Mock Kaiserin Search Result Page", () => {
  let logger: ILogger;

  beforeAll(async () => {
    logger = globalThis.createLogger();
  });

  // describe("execute()", () => {
  //   const pageHandle = new

  // });
});
