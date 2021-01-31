import { BrowserWindow, ipcMain, Tray } from "electron";
import path from "path";
import url from "url";
var Positioner = require("electron-positioner");

let MainTray: Tray | null;
let TrayWindow: BrowserWindow | null;

const WINDOW_SIZE_DEFAULTS = {
  width: 800,
  height: 600,
  margin: {
    x: 0,
    y: 0,
  },
};

function createWindow(url: string) {
  TrayWindow = new BrowserWindow({
    height: WINDOW_SIZE_DEFAULTS.height,
    maxHeight: WINDOW_SIZE_DEFAULTS.height,
    width: WINDOW_SIZE_DEFAULTS.width,
    maxWidth: WINDOW_SIZE_DEFAULTS.width,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    useContentSize: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
    },
  });
  TrayWindow.setMenu(null);
  TrayWindow.loadURL(`${url}#/tray`);
  TrayWindow.hide();
  TrayWindow.on("blur", () => {
    if (!TrayWindow) return;
    if (!TrayWindow.webContents.isDevToolsOpened()) {
      TrayWindow.hide();

      ipcMain.emit("tray-window-hidden", {
        window: TrayWindow,
        tray: MainTray,
      });
    }
  });
  TrayWindow.on("close", (e) => {
    if (!TrayWindow) return;
    e.preventDefault();
    TrayWindow.hide();
  });
}
function toggleTrayWindow() {
  if (!TrayWindow) return;
  if (TrayWindow.isVisible()) {
    TrayWindow.hide();
  } else {
    TrayWindow.show();
  }
  ipcMain.emit("tray-window-hidden", {
    window: TrayWindow,
    tray: MainTray,
  });
}
function alignWindow() {
  if (!TrayWindow) return;
  if (!MainTray) return;
  const positioner = new Positioner(TrayWindow);
  const trayBounds = MainTray.getBounds();
  const position = positioner.calculate("trayCenter", trayBounds);
  if (!position) return;
  TrayWindow.setBounds({
    height: WINDOW_SIZE_DEFAULTS.height,
    width: WINDOW_SIZE_DEFAULTS.width,
    x: position.x,
    y: position.y,
  });
}
export function InitTray(url: string) {
  /**
   * Initial window options
   */
  MainTray = new Tray(path.join(__dirname, "Icon-32.png"));
  createWindow(url);

  MainTray.on("click", (e) => {
    ipcMain.emit("tray-window-clicked", { window: TrayWindow, tray: MainTray });
    toggleTrayWindow();
  });

  alignWindow();
  ipcMain.emit("tray-window-ready", { window: TrayWindow, tray: MainTray });
}
