import { type Page } from "puppeteer-core";

export async function getFeedContainer(gmapPage: Page, feedSelector: string) {
  const feedContainer = await gmapPage.$(feedSelector);

  if (!feedContainer)
    console.log("Chúng tôi không tìm thấy được feedContainer!");

  return feedContainer;
}

// Nên để Feed hay để chung cho Page luôn?
// Nếu để cho Feed thì Feed sẽ có hàm riêng
// Nếu để chung cho Page thì Page sẽ là tác nhân fetch chính, hay nói cách khác là Page sẽ được dùng để fetch
