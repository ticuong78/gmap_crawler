import pie from "puppeteer-in-electron";
import * as puppeteer from "puppeteer-core";
import { app, BrowserWindow, ipcMain } from "electron";
import { createWindow, windowOptions } from "./window.cjs";
import { delay, gaussianRandom } from "./utils.cjs";

let gmapBrowser: puppeteer.Browser;
let gmapWindow: BrowserWindow;
let mainWindow: BrowserWindow;
let gmapPage: puppeteer.Page;
let searchBox: puppeteer.ElementHandle<Element> | null;

const xpathConditions =
  'contains(text(),"Tìm kiếm trên Google Maps") or contains(text(),"Search Google Maps")';

const endMessages = [
  "You've reached the end of the list.",
  "Bạn đã xem hết danh sách này.",
];

// --- Logic ---

function sendGmapStatus(status: GmapStatus) {
  if (
    !mainWindow ||
    mainWindow.isDestroyed() ||
    mainWindow.webContents.isDestroyed()
  )
    return;
  mainWindow.webContents.send("gmap:status", status);
}

function sendGmapErrorMessage(errorMessage: GmapErrorMessage) {
  if (
    !mainWindow ||
    mainWindow.isDestroyed() ||
    mainWindow.webContents.isDestroyed()
  )
    return;
  mainWindow.webContents.send("gmap:error-message", errorMessage);
}

async function openGmap(showWindow: boolean = true) {
  try {
    sendGmapStatus("launching");

    if (gmapWindow.isDestroyed()) {
      gmapWindow = createWindow({ ...windowOptions, show: false });
    }

    gmapPage = await pie.getPage(gmapBrowser, gmapWindow);
    await gmapPage.goto("https://google.com/maps");

    const inputId = await gmapPage.$eval(
      `::-p-xpath(//label[${xpathConditions}])`,
      (el) => el.getAttribute("for"),
    );

    searchBox = await gmapPage.$(`#${inputId}`);
    if (!searchBox) throw Error("Không thể tìm thấy Search Box.");

    if (showWindow) gmapWindow.show();

    sendGmapStatus("ready");
  } catch (error) {
    // send status
    sendGmapStatus("error");
    sendGmapErrorMessage(
      error instanceof Error ? error.message : "Đã có lỗi xảy ra.",
    );
  }
}

async function searchGmap(keyword: string) {
  try {
    sendGmapStatus("searching"); // thêm vào
    if (!searchBox || !gmapPage) throw Error("Chưa mở Google Maps.");

    await searchBox.click({
      clickCount: 3,
      delay: Math.max(200, gaussianRandom(600, 150)),
    });

    await searchBox.type(keyword, {
      delay: Math.max(50, gaussianRandom(120, 30)),
    });

    await gmapPage.keyboard.press("Enter");

    sendGmapStatus("ready");
  } catch (error) {
    sendGmapStatus("error");
    sendGmapErrorMessage(
      error instanceof Error ? error.message : "Đã có lỗi xảy ra.",
    );
  }
}

async function handleCrawl(keyword: string) {
  try {
    if (!gmapPage) {
      throw new Error("Google Maps chưa được khởi tạo, hãy mở Google Maps.");
    }

    if (!searchBox) {
      throw new Error("Hộp tìm kiếm chưa được khởi tạo, hãy mở Google Maps.");
    }

    sendGmapStatus("crawling");

    const ariaLabelVi = `Kết quả cho ${keyword}`;
    const ariaLabelEn = `Results for ${keyword}`;
    const feedSelector = `::-p-xpath(//div[contains(@aria-label,"${ariaLabelVi}") or contains(@aria-label,"${ariaLabelEn}")])`;

    const placesInfo: Array<{
      name: string;
      category: string;
      address: string;
      phone: string | null;
      website: string | null;
    }> = [];

    const processedNames = new Set<string>();

    while (true) {
      const feedContainer = await gmapPage.$(feedSelector);

      if (!feedContainer) {
        throw new Error(`Không tìm thấy kết quả cho từ khóa "${keyword}".`);
      }

      const feedItems = await feedContainer.$$("::-p-xpath(.//div[not(@*)])");

      if (feedItems.length === 0) {
        console.log("[INFO] Kết thúc scrape");
        break;
      }

      for (const item of feedItems) {
        await item.evaluate((el) => {
          (el as HTMLElement).style.backgroundColor = "#FFFF99";
        });

        const name = await item
          .$eval("a[aria-label]", (el) => {
            const ariaLabel = el.getAttribute("aria-label") ?? "";
            return ariaLabel.split("·")[0].trim();
          })
          .catch(() => "");

        if (!name || processedNames.has(name)) {
          continue;
        }

        processedNames.add(name);

        await item.click({
          delay: Math.max(200, gaussianRandom(600, 150)),
        });

        console.log(`[DEBUG] Đã click, đang chờ popup cho ${name}...`);

        try {
          let popUp;

          try {
            popUp = await gmapPage.waitForSelector(
              // popup trên gmapPage chứ không hải trong item
              `[role="main"][aria-label="${name}"]`,
              {
                timeout: 5000,
              },
            );
          } catch {
            await item.click({
              delay: Math.max(200, gaussianRandom(600, 150)),
            });
            popUp = await gmapPage.waitForSelector(
              // popup trên gmapPage chứ không hải trong item
              `[role="main"][aria-label="${name}"]`,
              {
                timeout: 5000,
              },
            );
          }

          if (!popUp)
            throw Error(
              "Không tìm thấy màng hình hiển thị thông tin địa điểm.",
            );

          const category = await popUp
            .$eval(
              `::-p-xpath(//button[contains(@jsaction,".category")])`,
              (el) => el.textContent?.trim() ?? "",
            )
            .catch(() => "");

          const infoSection = await popUp.$(
            `::-p-xpath(//*[contains(@aria-label,"Thông tin về ${name}") or contains(@aria-label,"Information for ${name}")])`,
          );

          if (!infoSection) {
            console.warn(`Bỏ qua "${name}" — không tìm thấy thông tin.`);
          } else {
            const address = await infoSection
              .$eval(
                `button[data-item-id="address"]`,
                (el) =>
                  el
                    .getAttribute("aria-label")
                    ?.replace("Địa chỉ: ", "")
                    ?.replace("Address: ", "")
                    .trim() ?? "",
              )
              .catch(() => "");

            const phoneEl = await infoSection.$(
              `button[data-item-id^="phone:tel:"]`,
            );

            const phone = phoneEl
              ? await phoneEl
                  .evaluate(
                    (el) =>
                      el
                        .getAttribute("data-item-id")
                        ?.replace("phone:tel:", "")
                        .trim() ?? "",
                  )
                  .catch(() => null)
              : null;

            const websiteEl = await infoSection.$(
              `a[data-item-id="authority"]`,
            );
            const website = websiteEl
              ? await websiteEl
                  .evaluate((el) => el.getAttribute("href") ?? "")
                  .catch(() => null)
              : null;

            placesInfo.push({
              name,
              category,
              address,
              phone,
              website,
            });
          }
        } catch (error) {
          console.warn(`Lỗi khi crawl "${name}":`, error);
        }

        await item.evaluate((el) => {
          (el as HTMLElement).style.backgroundColor = "";
        });
      }

      await feedContainer.evaluate((el, px) => {
        el.scrollTop += px;
      }, 1000);

      await delay(3000);
    }

    sendGmapStatus("done");
    return placesInfo;
  } catch (error) {
    sendGmapStatus("error");
    sendGmapErrorMessage(
      error instanceof Error ? error.message : "Đã có lỗi xảy ra.",
    );
  }
}

// --- Setup ---

function registerHandlers() {
  // ------- Listeners -------

  ipcMain.handle(
    "gmap:crawl",
    async (_event, keyword: string) => await handleCrawl(keyword),
  );

  ipcMain.on(
    "gmap:open",
    async (_event, showWindow: boolean = true) => await openGmap(showWindow),
  );

  ipcMain.on(
    "gmap:search",
    async (_event, keyword: string) => await searchGmap(keyword),
  );

  // ------- Actions -------

  gmapWindow.on("close", () => {
    sendGmapStatus("closed");
  });
}

export async function setupGmap(main: BrowserWindow) {
  mainWindow = main;
  gmapBrowser = await pie.connect(app, puppeteer);
  gmapWindow = createWindow({ ...windowOptions, show: false });
  registerHandlers();
}

export async function teardownGmap() {
  await gmapPage?.close();
  gmapWindow?.close();
}
