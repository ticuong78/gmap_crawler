export {};

declare global {
  interface Window {
    gmapAPI: {
      openGMap: (showWindow: boolean = true) => void;
      searchGMap: (keyword: string) => void;
    };
  }
}
