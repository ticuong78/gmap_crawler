import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("gmapAPI", {
  openGMap: (showWindow: boolean = true) =>
    ipcRenderer.send("gmap:open", showWindow),
  searchGMap: (keyword: string) => ipcRenderer.send("gmap:search", keyword),
});
