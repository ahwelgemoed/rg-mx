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
    let address;
    for (const key1 in nets) {
      if (Object.prototype.hasOwnProperty.call(nets, key1)) {
        const element1 = nets[key1];
        for (const key2 in element1) {
          if (Object.prototype.hasOwnProperty.call(element1, key2)) {
            const element2 = element1[key2 as any];
            if (element2.family === "IPv4") {
              return (address = element2.address);
            }
          }
        }
      }
    }
  }
  return "NO IP FOUND";
}
