// const platform = require('os').platform()
const path = require("path");
const name = require("../../../package.json").name;
import { networkInterfaces, platform } from "os";

export const home = process.env.HOME;

export const dataPath =
  process.env.NODE_ENV === "development"
    ? path.join(__dirname, "../../../data")
    : path.join(process.resourcesPath, "data");

export const slash = platform() === "darwin" ? "/" : "\\";

export function getAppDataPath() {
  switch (process.platform) {
    case "darwin": {
      return path.join(
        process.env.HOME,
        "Library",
        "Application Support",
        name
      );
    }
    case "win32": {
      return path.join(process.resourcesPath, "data");
    }
    case "linux": {
      return path.join(process.env.HOME, `.${name}`);
    }
    default: {
      console.log("Unsupported platform!");
      process.exit(1);
    }
  }
}

export function getWindowsIp() {
  if (process.platform == "win32") {
    const nets = networkInterfaces();
    const { Ethernet } = nets;
    if (!Ethernet) return "NO IP FOUND";
    const foundIP = Ethernet.find((ips: any) => {
      if (ips.family === "IPv4") {
        return ips.address;
      }
    });
    return foundIP && foundIP.address ? foundIP.address : "NO IP FOUND";
  }
  return "NO IP FOUND";
}
