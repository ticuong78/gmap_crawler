export {};

declare global {
  interface Window {
    windowAPI: {
      openGMap: () => void;
    };
  }
}
