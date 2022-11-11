const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("platform", {
  getVersion: (platform: string) => ipcRenderer.invoke("get-version", platform),
});
