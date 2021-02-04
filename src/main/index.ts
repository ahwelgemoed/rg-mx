import { app, BrowserWindow } from "electron";
import { InitTray } from "./trayIndex";
const Store = require("electron-store");
import { initiateServer, initiateSocket } from "./socketServer";
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow: BrowserWindow | null;

const winURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:9080"
    : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();
  setTimeout(() => {
    initiateServer;
    initiateSocket();
  }, 3000);
  if (process.platform === "darwin") {
    InitTray(winURL);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'
autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})
app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
*/

// app.on("ready", () => {

// });

// const OPEN_MENDIX_PRO
// const SETUP_GULP
// const OPEN_CMD_WINDOWS
// const OPEN_CALYPSO
// const OPEN_STYLES_ON_MAC
// const OPEN_ANDROID_SIMULATOR_MX8
// const OPEN_ANDROID_SIMULATOR_MX9
