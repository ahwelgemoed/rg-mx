import spawnAsync from "@expo/spawn-async";
import axios from "axios";

import { exec } from "child_process";
import path from "path";
import { dataPath } from "../utils";
import { createStandaloneToast } from "@chakra-ui/react";
import icon from "../assets/Icon-128.png";
import fs from "fs";
import unzipper from "unzipper";
import AdmZip from "adm-zip";

const electron = require("electron");
const spawn = require("cross-spawn");

const toast = createStandaloneToast();
export const witchSimulatorIsInstalled = async () => {
  try {
    const { stdout } = await spawnAsync("emulator", ["-list-avds"], {
      env: {
        NODE_ENV: "production",
        PATH: process.env.PATH,
      },
    });

    return stdout;
  } catch (error) {
    toast({
      status: "error",
      title: "Error",
      description: "Cant Find Installed Android Sims",
      duration: 7000,
      position: "top",
      isClosable: true,
    });
    throw new Error(error);
  }
};

export const startupSimulator = async (selectedDevice: string) => {
  toast({
    status: "success",
    title: "Starting Up",
    description: `${selectedDevice}`,
    duration: 7000,
    position: "top",
    isClosable: true,
  });
  exec(`emulator -avd ${selectedDevice}`, (err, stdout, stderr) => {
    // if (err) {
    //   console.log("err", err);
    //   toast({
    //     status: "error",
    //     title: "Error",
    //     description: `Android Sim Not Started`,
    //     duration: 7000,
    //     position: "top",
    //     isClosable: true,
    //   });
    // }
  });
};

export const installMendixApp = async (version: number) => {
  toast({
    status: "success",
    title: "Installing",
    description: `Make It Native V${version}`,
    duration: 7000,
    position: "top",
    isClosable: true,
  });

  try {
    if (version === 8) {
      for (let index = 1; index < 5; index++) {
        const { stdout } = await spawnAsync("adb", [
          "install-multiple",
          getApk8(index),
        ]);
        return stdout;
      }
    }
    if (version === 9) {
      const { stdout } = await spawnAsync("adb", [
        "install-multiple",
        getIDofApk(),
      ]);
      return stdout;
    }
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};
const getApk8 = (name: number): string => {
  return `${dataPath}/mx8/${name}.apk`;
};
const getIDofApk = (): string => {
  return `${dataPath}/mx9/min9.apk`;
};

export const openMendixApp = async (installedAppName: string) => {
  const openAppSusses = new electron.remote.Notification({
    title: "Opened",
    body: "Make it Native Has Been Opened",
    silent: true,
    icon: icon,
  });
  openAppSusses.show();
  // toast({
  //   status: "success",
  //   title: "Opening",
  //   description: `${installedAppName}`,
  //   duration: 7000,
  //   position: "top",
  //   isClosable: true,
  // });
  try {
    const { stdout } = await spawnAsync("adb", [
      "shell",
      "monkey",
      `-p ${installedAppName}`,
      "-v 1",
    ]);
    return stdout;
  } catch (error) {
    toast({
      status: "error",
      title: "Error",
      description: `${error}`,
      duration: 7000,
      position: "top",
      isClosable: true,
    });
    // openMendixAppSpinner.fail("Mendix App could not be Opened");
    throw new Error(error);
  }
};

export const listAllAppsOnDevice = async (version: number) => {
  try {
    //   package:com.mendix.developerapp
    const { stdout } = await spawnAsync("adb", ["shell", "pm list packages"]);
    const allApps = stdout.split("\n").find((x) => {
      if (x.includes("mendix")) {
        if (version === 9 && x.includes("mx9")) {
          return x;
        }
        if (version === 8 && !x.includes("mx9")) {
          return x;
        }
      }
    });
    if (allApps) {
      return allApps.split("package:")[1];
    } else {
      return false;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const checkIfBootHasCompleted = async () => {
  try {
    const result = await spawnAsync("adb", [
      "shell",
      "am broadcast",
      "-a android.intent.action.ACTION_BOOT_COMPLETED",
    ]);
    return result;
  } catch (error) {
    return error;
  }
};

export async function downloadMendixApps(version: number) {
  let done = false;
  toast({
    status: "warning",
    title: "Downloading...",
    description: `Make It Native V${version}`,
    duration: 3000,
    position: "top",
    isClosable: true,
  });
  try {
    const response = await axios.get(
      `https://raw.githubusercontent.com/ahwelgemoed/rg-mx/main/github-images/mx${version}.zip`,
      { responseType: "blob" }
    );

    const blob = await new Blob([response.data], { type: "application/zip" });
    // const downloadUrl = await window.URL.createObjectURL(blob);
    const filePath = `${dataPath}/mx${version}.zip`;
    const buffer = await new Buffer(await blob.arrayBuffer());
    await fs.writeFile(filePath, buffer, async function (err) {
      if (err) {
        toast({
          status: "error",
          title: "Error",
          description: `${err}`,
          duration: 7000,
          position: "top",
          isClosable: true,
        });
        return;
      }
      toast({
        status: "success",
        title: "Download Done",
        description: `Make It Native V${version}`,
        duration: 7000,
        position: "top",
        isClosable: true,
      });
      const zip = await new AdmZip(filePath);
      await zip.extractAllTo(`${dataPath}/`, true);
    });

    return done;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
  // axios({
  //   url: `https://raw.githubusercontent.com/ahwelgemoed/rg-mx/main/github-images/mx${version}.zip`,
  //   method: "GET",
  //   responseType: "blob",
  // }).then(async (response) => {
  //   console.log("response", response);
  //   const disposition = response.request.getResponseHeader(
  //     "Content-Disposition"
  //   );

  //   var fileName = "";
  //   var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  //   var matches = filenameRegex.exec(disposition);
  //   if (matches != null && matches[1]) {
  //     fileName = matches[1].replace(/['"]/g, "");
  //   }
  //   let blob = new Blob([response.data], { type: "application/zip" });
  //   const downloadUrl = window.URL.createObjectURL(blob);
  //   const filePath = `${dataPath}/mx${version}.zip`;
  //   var buffer = new Buffer(await blob.arrayBuffer());
  //   fs.writeFile(filePath, buffer, function (err) {
  //     if (err) throw err;
  //   });
  // });
}
// const downer = () => {
//   // axios({
//   //   url: "http://localhost:1233/downloads/mx8",
//   //   method: "GET",
//   //   // responseType: "blob",
//   //   responseType: "arraybuffer",
//   //   headers: {
//   //     "Content-Type": "multipart/form-data",
//   //   },
//   //   // responseType: "blob", // important
//   // }).then(async (response) => {
//   //   console.log("response", response);
//   //   const disposition = response.request.getResponseHeader(
//   //     "Content-Disposition"
//   //   );

//   //   var fileName = "";
//   //   var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
//   //   var matches = filenameRegex.exec(disposition);
//   //   if (matches != null && matches[1]) {
//   //     fileName = matches[1].replace(/['"]/g, "");
//   //   }
//   //   let blob = new Blob([response.data], { type: "application/zip" });
//   //   const downloadUrl = window.URL.createObjectURL(blob);
//   //   const filePath = `${dataPath}/mx4.zip`;
//   //   var buffer = new Buffer(await blob.arrayBuffer());
//   //   fs.writeFile(filePath, buffer, function (err) {
//   //     if (err) throw err;
//   //   });
//   axios({
//     url:
//       "https://raw.githubusercontent.com/ahwelgemoed/rg-mx/main/data/mx8/1.apk",
//     method: "GET",
//     responseType: "blob",
//     // responseType: "arraybuffer",
//     // headers: {
//     //   "Content-Type": "multipart/form-data",
//     // },
//     // responseType: "blob", // important
//   }).then(async (response) => {
//     console.log("response", response);
//     const disposition = response.request.getResponseHeader(
//       "Content-Disposition"
//     );

//     var fileName = "";
//     var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
//     var matches = filenameRegex.exec(disposition);
//     if (matches != null && matches[1]) {
//       fileName = matches[1].replace(/['"]/g, "");
//     }
//     let blob = new Blob([response.data], { type: "application/zip" });
//     const downloadUrl = window.URL.createObjectURL(blob);
//     const filePath = `${dataPath}/mx4.apk`;
//     var buffer = new Buffer(await blob.arrayBuffer());
//     fs.writeFile(filePath, buffer, function (err) {
//       if (err) throw err;
//     });

//     // let a = document.createElement("a");
//     // a.href = downloadUrl;
//     // a.download = fileName;
//     // document.body.appendChild(a);
//     // a.click();
//   });
// };
