const platform = require("os").platform();
const path = require("path");
const name = require("../../../package.json").name;

export const home = process.env.HOME;

export const dataPath =
  process.env.NODE_ENV === "development"
    ? path.join(__dirname, "../../../data")
    : path.join(process.resourcesPath, "data");
export const slash = platform === "darwin" ? "/" : "\\";
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
      // return path.join(process.env.APPDATA, "frontr-app");
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
