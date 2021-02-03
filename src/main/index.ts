import { app, BrowserWindow } from "electron";
import { InitTray } from "./trayIndex";
const Store = require("electron-store");
const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

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
    http.listen(7891);
    x();
  }, 3000);

  // InitTray(winURL);
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
const x = () => {
  console.log("SOCKET");

  io.on("connection", (socket: any) => {
    console.info(`Client connected [id=${socket.id}]`);
    socket.broadcast.emit("broadcast", "hello friends!");

    // initialize this client's sequence number
    socket.on("newChatMessage", (data) => {
      console.log("data", data);
    });

    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
      console.info(`Client gone [id=${socket.id}]`);
    });
  });
};

// const OPEN_MENDIX_PRO
// const SETUP_GULP
// const OPEN_CMD_WINDOWS
// const OPEN_CALYPSO
// const OPEN_STYLES_ON_MAC
// const OPEN_ANDROID_SIMULATOR_MX8
// const OPEN_ANDROID_SIMULATOR_MX9
