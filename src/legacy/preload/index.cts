import { contextBridge, ipcRenderer } from "electron";

// keep Promise

contextBridge.exposeInMainWorld("gmapAPI", {
  // ------- Actions -------

  openGmap: (showWindow: boolean = true) =>
    ipcRenderer.send("gmap:open", showWindow),
  searchGmap: (keyword: string) => ipcRenderer.send("gmap:search", keyword),
  crawl: (keyword: string) =>
    ipcRenderer.invoke("gmap:crawl", keyword).then((result) => result),

  // ------- Listeners -------

  onStatusChange: (callback: (status: GmapStatus) => void) => {
    const handler = (_event: unknown, status: GmapStatus) => callback(status);
    ipcRenderer.on("gmap:status", handler);
    return () => ipcRenderer.removeListener("gmap:status", handler); // trả về cleanup function
  },
  onErrorMessage: (callback: (msg: GmapErrorMessage) => void) => {
    const handler = (_event: unknown, status: GmapStatus) => callback(status);
    ipcRenderer.on("gmap:error-message", handler);
    return () => ipcRenderer.removeListener("gmap:error-message", handler); // trả về cleanup function
  },
});
