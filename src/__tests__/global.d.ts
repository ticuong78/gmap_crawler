import type { SingleOption } from "../utils";
import type { ElectronEnvironment } from "./electron.setup";
import type { createLogger as createLoggerFactory } from "./logger.setup";
import type {
  createNormalTestingContext as createNormalTestingContextFactory,
  createElectronTestingContext as createElectronTestingContextFactory,
} from "./context.setup";

export {};

declare global {
  var SEARCH_KEYWORD: string;
  var GOOGLE_MAP_URL: string;
  var GOOGLE_MAPS_QUERY_SEARCH_URL: string;

  var createAndSetupElectronEnvironment: (
    options?: SingleOption[],
    env?: NodeJS.ProcessEnv,
  ) => Promise<ElectronEnvironment>;

  var createLogger: () => ReturnType<typeof createLoggerFactory>;
  var createNormalTestingContext: () => Promise<
    ReturnType<typeof createNormalTestingContextFactory>
  >;
  var createElectronTestingContext: (
    environment: ElectronEnvironment,
  ) => Promise<ReturnType<typeof createElectronTestingContextFactory>>;
  var readMockAssets: (mockingName: string) => Promise<string>;
  var comopseTestingContext: (
    browser: puppeteer.Browser,
    page: puppeteer.Page,
  ) => Promise<TestingContext>;

  var teardownTestRuntime: (runtime?: {
    testingContext?: { teardown: () => Promise<boolean> };
    electronEnvironment?: {
      teardown: () => Promise<number>;
    };
  }) => Promise<void>;
}
