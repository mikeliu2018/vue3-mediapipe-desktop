import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

// if (process.env["VITE_DEV_SERVER_HOST"] === undefined)
//   process.env["VITE_DEV_SERVER_HOST"] = "localhost";
// if (process.env["VITE_DEV_SERVER_PORT"] === undefined)
//   process.env["VITE_DEV_SERVER_PORT"] = "5173";

console.log("app.isPackaged", app.isPackaged);
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
  const win = new BrowserWindow({
    webPreferences: {
      // contextIsolation: true,
      // nodeIntegration: true,
      preload: path.join(__dirname, "../dist-electron/preload.js"),
      // devTools: process.env.NODE_ENV !== "production",
      devTools: true,
    },
  });
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    //  Use ['ENV_NAME'] avoid vite:define plugin
    const url =
      process.env.VITE_DEV_SERVER_URL !== undefined
        ? process.env.VITE_DEV_SERVER_URL
        : `http://${process.env.VITE_DEV_SERVER_HOST}:${process.env.VITE_DEV_SERVER_PORT}`;
    win.loadURL(url);
    console.log("url", url);

    // if (process.env["NODE_ENV"] === "development")
    win.webContents.openDevTools();
  }
};
app.whenReady().then(() => {
  ipcMain.handle("get-version", (event, platform) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    // console.log("win", win);
    return process.versions[`${platform}`];
  });

  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
