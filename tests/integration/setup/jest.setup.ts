import * as path from "path";
import { SingleOption } from "@tests/support/electron-options";
import { createElectronTestingContext } from "@tests/integration/support/context";
import { createElectronEnvironment } from "@tests/integration/support/electron-environment";
import { createLogger } from "@tests/integration/support/logger";

const jestWorkerId = Number(process.env.JEST_WORKER_ID ?? "1");
const remoteDebuggingPort = 9222 + Math.max(jestWorkerId - 1, 0);
const googleMapsLocaleQuery = "hl=vi&gl=VN";
const defaultGoogleMapsSearchKeyword = "starbucks washington dc";

const electronOptions: SingleOption[] = [
  { key: "RemoteDebuggingPort", value: remoteDebuggingPort },
  { key: "NoSandbox" },
  { key: "DisableGPU" },
  { key: "Lang", value: "vi-VN" },
];

export async function teardownTestRuntime(runtime?: {
  testingContext?: { teardown: () => Promise<boolean> };
  electronEnvironment?: {
    teardown: () => Promise<number>;
  };
}) {
  await runtime?.testingContext?.teardown();
  await runtime?.electronEnvironment?.teardown();
}

export default async function setupGlobals() {
  globalThis.SEARCH_KEYWORD =
    process.env.TEST_GOOGLE_MAPS_SEARCH_KEYWORD?.trim() ||
    defaultGoogleMapsSearchKeyword;
  globalThis.GOOGLE_MAP_URL = `https://www.google.com/maps?${googleMapsLocaleQuery}`;
  globalThis.GOOGLE_MAPS_QUERY_SEARCH_URL = `https://www.google.com/maps/search/${encodeURIComponent(globalThis.SEARCH_KEYWORD)}?${googleMapsLocaleQuery}`;
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
  globalThis.createElectronTestingContext = createElectronTestingContext;
  globalThis.createLogger = createLogger;
  globalThis.teardownTestRuntime = teardownTestRuntime;
}

setupGlobals();
