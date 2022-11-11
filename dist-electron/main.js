"use strict";
const electron = require("electron");
const path = require("path");
const _interopDefaultLegacy = (e) => e && typeof e === "object" && "default" in e ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefaultLegacy(path);
console.log("app.isPackaged", electron.app.isPackaged);
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log(
  "process.env.VITE_DEV_SERVER_HOST",
  process.env.VITE_DEV_SERVER_HOST
);
console.log(
  "process.env.VITE_DEV_SERVER_PORT",
  process.env.VITE_DEV_SERVER_PORT
);
const createWindow = () => {
  const win = new electron.BrowserWindow({
    webPreferences: {
      preload: path__default.default.join(__dirname, "../dist-electron/preload.js"),
      devTools: true
    }
  });
  if (electron.app.isPackaged) {
    win.loadFile(path__default.default.join(__dirname, "../dist/index.html"));
  } else {
    const url = process.env.VITE_DEV_SERVER_URL !== void 0 ? process.env.VITE_DEV_SERVER_URL : `http://${process.env.VITE_DEV_SERVER_HOST}:${process.env.VITE_DEV_SERVER_PORT}`;
    win.loadURL(url);
    console.log("url", url);
    win.webContents.openDevTools();
  }
};
electron.app.whenReady().then(() => {
  electron.ipcMain.handle("get-version", (event, platform) => {
    return process.versions[`${platform}`];
  });
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
