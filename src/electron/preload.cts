import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("windowAPI", {
  openGMap: () => ipcRenderer.send("open-gmap"),
});
