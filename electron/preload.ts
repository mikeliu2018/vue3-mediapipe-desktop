import { IpcRendererEvent } from "electron";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getPlatformVersion: (platform: string) =>
    ipcRenderer.invoke("get-platform-version", platform),
  handleLoginWithGoogle: async (
    callback: (e: IpcRendererEvent, v: UserToken) => Promise<void>
  ) => ipcRenderer.on("handle-login-with-google", callback),
});
