import type { SingleOption } from "../utils";
import type { ElectronEnvironment } from "./electron.setup";
import type { createLogger as createLoggerFactory } from "./logger.setup";
import type { createTestingContext as createTestingContextFactory } from "./context.setup";

export {};

declare global {
  var SEARCH_KEYWORD: string;
  var GOOGLE_MAP_URL: string;
  var GOOGLE_MAPS_QUERY_SEARCH_URL: string;

  var createAndSetupElectronEnvironment: (
    options?: SingleOption[],
    env?: NodeJS.ProcessEnv,
  ) => Promise<ElectronEnvironment>;

  var createLogger: typeof createLoggerFactory;
  var createTestingContext: typeof createTestingContextFactory;

  var teardownTestRuntime: (runtime?: {
    testingContext?: { teardown?: () => Promise<void> | void };
    electronEnvironment?: {
      teardown?: () => Promise<number> | Promise<void> | void;
    };
  }) => Promise<void>;
}
