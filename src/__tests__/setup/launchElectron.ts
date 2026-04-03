import { spawn, ChildProcess } from "child_process";
import * as puppeteer from "puppeteer-core";
import * as path from "path";
import { ConsoleLogger } from "../../2_infrastructure/loggers/ConsoleLogger";

const electronPath = require("electron") as unknown as string;
let electronProcess: ChildProcess;

export async function launchElectron(): Promise<puppeteer.Browser> {
  return new Promise((resolve, reject) => {
    let resolved = false;

    electronProcess = spawn(
      electronPath,
      [
        "--remote-debugging-port=9222",
        "--no-sandbox",
        "--disable-gpu",
        "--lang=vi-VN",
        path.join(__dirname, "../../../dist-electron-test/test-main.cjs"), // compiled main
      ],
      {
        env: { ...process.env, NODE_ENV: "test", LANG: "vi_VN.UTF-8" },
      },
    );

    electronProcess.stderr?.on("data", async (data: Buffer) => {
      const output = data.toString();
      const wsMatch = output.match(
        /ws:\/\/127\.0\.0\.1:9222\/devtools\/browser\/[a-z0-9-]+/,
      );

      if (wsMatch && !resolved) {
        resolved = true;
        try {
          const browser = await puppeteer.connect({
            browserWSEndpoint: wsMatch[0],
          });
          resolve(browser);
        } catch (err) {
          reject(err);
        }
      }
    });

    electronProcess.stdout?.on("data", async (data: Buffer) => {
      console.log("[Electron stdout]:", data.toString());
      if (data.toString().includes("ELECTRON_READY")) {
        const browser = await puppeteer.connect({
          browserURL: "http://localhost:9222",
        });
        resolve(browser);
      }
    });
  });
}

export async function createTestContext(url: string) {
  const browser = await launchElectron();
  const page = (await browser.pages())[0];

  await page.setExtraHTTPHeaders({
    "Accept-Language": "vi-VN,vi;q=0.9",
  });

  await page.goto(url, { waitUntil: "networkidle2" });
  return { browser, page };
}

export function createLogger() {
  return new ConsoleLogger();
}

export function teardown() {
  if (electronProcess && !electronProcess.killed) {
    return electronProcess.kill("SIGTERM");
  }
}
