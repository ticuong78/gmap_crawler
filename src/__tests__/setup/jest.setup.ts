import * as path from "path";
import { SingleOption } from "../utils";
import { createTestingContext } from "./context.setup";
import { createElectronEnvironment } from "./electron.setup";
import { createLogger } from "./logger.setup";

const electronOptions: SingleOption[] = [
  { key: "RemoteDebuggingPort", value: 9222 },
  { key: "NoSandbox" },
  { key: "DisableGPU" },
  { key: "Lang", value: "vi-VN" },
];

export async function teardownTestRuntime(runtime?: {
  testingContext?: { teardown?: () => Promise<void> };
  electronEnvironment?: { teardown?: () => Promise<void> };
}) {
  await runtime?.testingContext?.teardown?.();
  await runtime?.electronEnvironment?.teardown?.();
}

export default async function setupGlobals() {
  globalThis.SEARCH_KEYWORD = "kaiserin";
  globalThis.GOOGLE_MAP_URL = "https://www.google.com/maps";
  globalThis.GOOGLE_MAPS_QUERY_SEARCH_URL = `https://www.google.com/maps/search/${globalThis.SEARCH_KEYWORD}`;
  globalThis.createAndSetupElectronEnvironment = async (
    options: SingleOption[] = [],
    env?: NodeJS.ProcessEnv,
  ) => {
    const environment = createElectronEnvironment(
      [...electronOptions, ...options],
      env,
    );

    await environment.launch(
      path.join(__dirname, "../../../dist-electron-test/main.cjs"),
    );

    return environment;
  };
  globalThis.createTestingContext = createTestingContext;
  globalThis.createLogger = createLogger;
  globalThis.teardownTestRuntime = teardownTestRuntime;
}

setupGlobals();
