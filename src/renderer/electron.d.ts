export {};

declare global {
  interface Window {
    gmapAPI: {
      openGmap: (showWindow: boolean = true) => void;
      searchGmap: (keyword: string) => void;
      crawl: (keyword: string) => void;
      onStatusChange: (callback: (status: GmapStatus) => void) => Function;
      onErrorMessage: (callback: (msg: GmapErrorMessage) => void) => Function;
    };
  }
}
