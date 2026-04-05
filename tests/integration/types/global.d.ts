import type { SingleOption } from "../../support/electron-options";
import type { ElectronEnvironment } from "../support/electron-environment";
import type { createLogger as createLoggerFactory } from "../support/logger";
import type {
  createElectronTestingContext as createElectronTestingContextFactory,
} from "../support/context";

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
  var createElectronTestingContext: (
    environment: ElectronEnvironment,
  ) => Promise<ReturnType<typeof createElectronTestingContextFactory>>;

  var teardownTestRuntime: (runtime?: {
    testingContext?: { teardown: () => Promise<boolean> };
    electronEnvironment?: {
      teardown: () => Promise<number>;
    };
  }) => Promise<void>;
}
