import { spawn, ChildProcess } from "child_process";
import { ElectronOptions, SingleOption } from "@tests/support/electron-options";

const electronPath = require("electron") as unknown as string;

export function createElectronEnvironment(
  options: SingleOption[],
  env?: NodeJS.ProcessEnv,
): ElectronEnvironment {
  return new ElectronEnvironment(options, env);
}

export class ElectronEnvironment {
  private _electronProcess?: ChildProcess;
  private _electronOptions: ElectronOptions;
  private readonly _env: NodeJS.ProcessEnv;

  constructor(options: SingleOption[], env?: NodeJS.ProcessEnv) {
    const { ELECTRON_RUN_AS_NODE: _ignoredElectronRunAsNode, ...parentEnv } =
      process.env;

    this._electronOptions = new ElectronOptions(options);
    this._env = {
      ...parentEnv,
      NODE_ENV: "test",
      LANG: "vi_VN.UTF-8",
      ...env,
    };
  }

  addOption(option: SingleOption): void {
    this._electronOptions.add(option);
  }

  removeOption(key: string): void {
    this._electronOptions.remove(key);
  }

  async launch(compiledElectronPath: string): Promise<void> {
    const args = this.buildArgs(compiledElectronPath);
    this._electronProcess = this.spawnProcess(args);

    await this.waitUntilReady();
  }

  getDebugPort(): number {
    return this._electronOptions.getRemoteDebuggingPort(9222);
  }

  teardown(): Promise<number> {
    const process = this._electronProcess;

    if (!process) return Promise.resolve(-1);

    return new Promise((resolve) => {
      const finalize = (result: number): void => {
        this._electronProcess = undefined;
        resolve(result);
      };

      process.once("exit", () => finalize(1));
      process.once("error", () => finalize(0));

      if (!process.kill("SIGTERM")) {
        finalize(0);
      }
    });
  }

  private buildArgs(compiledElectronPath: string): string[] {
    return [compiledElectronPath];
  }

  private spawnProcess(args: string[]): ChildProcess {
    const child = spawn(electronPath, args, {
      env: {
        ...this._env,
        TEST_ELECTRON_OPTIONS_JSON: JSON.stringify(
          this._electronOptions.toJSON(),
        ),
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    if (this._env.DEBUG_ELECTRON_TEST === "1") {
      child.stdout?.on("data", (data: Buffer) => {
        console.log("[electron stdout]", data.toString());
      });

      child.stderr?.on("data", (data: Buffer) => {
        console.error("[electron stderr]", data.toString());
      });
    }

    return child;
  }

  private waitUntilReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = this._electronProcess;

      if (!process) {
        reject(new Error("Electron process has not been started."));
        return;
      }

      let settled = false;

      const resolveOnce = (): void => {
        if (settled) return;
        settled = true;
        resolve();
      };

      process.stderr?.on("data", (data: Buffer) => {
        const output = data.toString();
        const wsMatch = output.match(
          new RegExp(
            `ws://127\\.0\\.0\\.1:${this.getDebugPort()}/devtools/browser/[a-z0-9-]+`,
          ),
        );

        if (wsMatch) {
          resolveOnce();
        }
      });

      process.stdout?.on("data", (data: Buffer) => {
        const output = data.toString();

        if (output.includes("ELECTRON_READY")) {
          resolveOnce();
        }
      });

      process.on("error", (error) => {
        if (!settled) reject(error);
      });

      process.on("exit", (code) => {
        if (!settled) {
          reject(
            new Error(
              `Electron exited before becoming ready. Exit code: ${code}`,
            ),
          );
        }
      });
    });
  }
}

