import type { SingleOption } from "../utils";
import type { ElectronEnvironment } from "./electron.setup";
import type { createLogger as createLoggerFactory } from "./logger.setup";
import type { createTestingContext as createTestingContextFactory } from "./context.setup";

export {};

type Teardownable = {
  teardown?: () => Promise<void>;
};

type TestRuntime = {
  testingContext?: Teardownable;
  electronEnvironment?: Teardownable;
};

declare global {
  var SEARCH_KEYWORD: string;
  var GOOGLE_MAP_URL: string;
  var GOOGLE_MAPS_QUERY_SEARCH_URL: string;

  var createAndSetupElectronEnvironment: (
    options?: SingleOption[],
    env?: NodeJS.ProcessEnv,
  ) => ElectronEnvironment;

  var createLogger: typeof createLoggerFactory;
  var createTestingContext: typeof createTestingContextFactory;

  var teardownTestRuntime: (runtime?: TestRuntime) => Promise<void>;
}
