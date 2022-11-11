"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("platform", {
  getVersion: (platform) => ipcRenderer.invoke("get-version", platform)
});
