import { RootStore } from "./RootStore";
import { action, observable, makeObservable, computed } from "mobx";
import spawnAsync from "@expo/spawn-async";
import { persist } from "mobx-persist";
import fs from "fs";
import { createStandaloneToast } from "@chakra-ui/react";
import { slash, dataPath } from "../utils";
import {
  FolderNamesType,
  ProjectType,
  FolderSortEnum,
} from "../types/projectTypes";

const platform = require("os").platform();
const { exec } = require("child_process");
const spawn = require("cross-spawn");
const toast = createStandaloneToast();

const PROJECTS_SORTED = "projects_Sorted";
const PROJECTS_PATH_MAC = "projectsStore";
const PROJECTS_PATH_Win = "projectsStoreWin";
const GULP_SORTED = "gulpPath";
const SORT_OPTION = "sortOption";

export class ProjectsStore {
  rootStore: RootStore;
  store: any;
  sortOption: FolderSortEnum;
  constructor(rootStore: RootStore, store: any) {
    makeObservable(this);
    this.store = store;
    this.rootStore = rootStore;
    this.mendixProjectsPathOnWindows = this.store.get(PROJECTS_PATH_MAC);
    this.mendixProjectsPathWin = this.store.get(PROJECTS_PATH_Win);
    this.gulpPath = this.store.get(GULP_SORTED);
    this.projectsSorted = this.store.get(PROJECTS_SORTED);
    this.sortOption = this.store.get(SORT_OPTION);
  }

  checkForMPR = (name: string): boolean => {
    return name.substr(name.length - 4) == ".mpr";
  };

  @persist @observable mendixProjectsPathOnWindows = "";
  @persist @observable mendixProjectsPathWin = "";
  @persist @observable gulpPath = "";
  @observable projectLoading = false;
  @persist projectsSorted: ProjectType[] = [];
  isDarwin = platform === "darwin";

  @action setSortPath(option: FolderSortEnum) {
    this.sortOption = option;
    this.store.set(SORT_OPTION, this.sortOption);
  }

  @action setGulpPath(stringPath: string) {
    this.gulpPath = stringPath;
    this.store.set(GULP_SORTED, this.gulpPath);
    toast({
      title: "Gulp Folder Location Added",
      status: "success",
      duration: 5000,
      position: "top",
      isClosable: true,
    });
  }

  @action setProjectPath(stringPath: string) {
    this.mendixProjectsPathOnWindows = stringPath;
    this.store.set("projectsStore", this.mendixProjectsPathOnWindows);
    toast({
      title: "Projects Folder Added",
      status: "success",
      duration: 5000,
      position: "top",
      isClosable: true,
    });
  }

  @action setLoading(value: boolean) {
    return (this.projectLoading = value);
  }

  @action similar(a: any, b: any) {
    let equivalency = 0;
    const minLength = a.length > b.length ? b.length : a.length;
    const maxLength = a.length < b.length ? b.length : a.length;
    for (let i = 0; i < minLength; i++) {
      if (a[i] == b[i]) {
        equivalency++;
      }
    }

    const weight = equivalency / maxLength;
    return weight * 100;
  }

  setPlainFolders() {
    this.setLoading(true);
    setTimeout(() => {
      const foundNames: FolderNamesType[] = [];
      const rawFiles = fs.readdirSync(this.mendixProjectsPathOnWindows);
      rawFiles.forEach((file) => {
        const PROJECT_PATH = `${this.mendixProjectsPathOnWindows}/${file}`;
        // If Directory
        if (fs.lstatSync(PROJECT_PATH).isDirectory()) {
          const branshFiels = fs.readdirSync(PROJECT_PATH);
          branshFiels.map((files) => {
            if (this.checkForMPR(files)) {
              const stats = fs.statSync(`${PROJECT_PATH}/${files}`);
              return foundNames.push({
                name: file,
                lastModified: stats.mtime,
              });
            }
          });
        }
      });
      const dateSortedList: ProjectType[] = [];
      (foundNames as ProjectType[]).sort(function (
        a: FolderNamesType,
        b: FolderNamesType
      ) {
        return (
          new Date(b.lastModified).getTime() -
          new Date(a.lastModified).getTime()
        );
      });

      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      this.projectsSorted = foundNames as ProjectType[];
      this.store.set(PROJECTS_SORTED, this.projectsSorted);
      toast({
        title: `${foundNames.length} Projects added`,
        status: "success",
        duration: 7000,
        position: "top",
        isClosable: true,
      });
    }, 100);
    this.setLoading(false);
  }

  private setSmartFolders() {
    this.setLoading(true);
    setTimeout(() => {
      let sortableUnq: string[] = [""];
      if (!this.mendixProjectsPathOnWindows) {
        this.setLoading(false);
        toast({
          title: "No Projects Folder Specified",
          status: "error",
          duration: 5000,
          position: "top",
          isClosable: true,
        });
      }
      const rawFiles = fs.readdirSync(this.mendixProjectsPathOnWindows);
      rawFiles.forEach((file) => {
        const PROJECT_PATH = `${this.mendixProjectsPathOnWindows}/${file}`;
        // If Directory
        if (fs.lstatSync(PROJECT_PATH).isDirectory()) {
          const branshFiels = fs.readdirSync(PROJECT_PATH);
          branshFiels.map((files) => {
            if (this.checkForMPR(files)) {
              const splitNameArray = file.split("-");
              sortableUnq.push(splitNameArray[0]);
            }
          });
        }
      });
      sortableUnq = [...new Set(sortableUnq)];
      const filtered = sortableUnq.filter(function (el) {
        return el != null;
      });
      // Sort and Group Projects
      const sortedList: any[] = filtered.reduce((a: any[], c: string) => {
        const foundNames: FolderNamesType[] = [];
        rawFiles.forEach((name) => {
          const PROJECT_PATH = `${this.mendixProjectsPathOnWindows}/${name}`;
          if (!name.startsWith(".")) {
            // hidden Files
            if (fs.lstatSync(PROJECT_PATH).isDirectory()) {
              const branshFiels = fs.readdirSync(PROJECT_PATH);
              branshFiels.map((files) => {
                if (this.checkForMPR(files)) {
                  const stats = fs.statSync(`${PROJECT_PATH}/${files}`);
                  const nameLenght = name.length;
                  const subName = name.substring(0, nameLenght / 2);
                  1;
                  if (c && name.includes(c)) {
                    return foundNames.push({
                      name,
                      lastModified: stats.mtime,
                    });
                  }
                }
              });
            }
          }
        });
        if (!c) {
          return a;
        }
        return [...a, { name: c, folderNames: foundNames }];
      }, []);
      const dateSortedList: ProjectType[] = [];
      (sortedList as ProjectType[]).forEach((x) => {
        x.folderNames.sort(function (a: FolderNamesType, b: FolderNamesType) {
          return (
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
          );
        });
        dateSortedList.push({
          ...x,
          lastModified: x.folderNames[0].lastModified,
        });
      });
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      this.projectsSorted = dateSortedList;
      this.store.set(PROJECTS_SORTED, this.projectsSorted);
      toast({
        title: `${sortedList.length} Projects added`,
        status: "success",
        duration: 7000,
        position: "top",
        isClosable: true,
      });
      this.setLoading(false);
    }, 100);
  }

  @action setSortedProjects(folderSort: FolderSortEnum) {
    if (folderSort === FolderSortEnum.Plain) {
      return this.setPlainFolders();
    }
    if (folderSort === FolderSortEnum.Smart) {
      return this.setSmartFolders();
    }
  }

  @action openStudioInProject(projectName: string, studioPath: string) {
    const buildString = `${studioPath}${slash}${projectName}`;
    // const buildString = `${studioPath}${slash}${projectName}`
    const branshFiels = fs.readdirSync(buildString);
    let fileToOpen;
    branshFiels.map((files) => {
      if (this.checkForMPR(files)) {
        fileToOpen = files;
      }
    });
    const fileStringToOpen = `${buildString}${slash}${fileToOpen}`;
    const openMX = spawn("start", ["", fileStringToOpen]);
    openMX.stderr.on("data", (data: any) => {
      toast({
        status: "error",
        title: "Error",
        description: `${data}`,
        duration: 7000,
        position: "top",
        isClosable: true,
      });
    });
    openMX.on("close", (code: any) => {
      if (!code) {
        toast({
          title: `Opening ${projectName}`,
          status: "success",
          duration: 7000,
          position: "top",
          isClosable: true,
        });
      }
    });
  }

  @action openProjectInCMD(projectName: string, studioPath: string) {
    if (platform !== "darwin") {
      const buildString = `${studioPath}${slash}${projectName}`;
      const filePath = `${dataPath}\\openProjectInCMD.bat`;
      fs.writeFile(
        filePath,
        `@echo off \r\ncd "${buildString}"\r\nstart ""\r\ndir`,
        function (err) {
          if (err) throw err;
          const openMX = spawn(filePath);
          toast({
            title: `Opening ${projectName}-CMD`,
            status: "success",
            duration: 7000,
            position: "top",
            isClosable: true,
          });
        }
      );
    }
  }

  @action async openInVsCode(projectName: string) {
    const buildString = `${this.mendixProjectsPathOnWindows}/${projectName}/theme/styles`;
    if (this.isDarwin) {
      try {
        const { stdout } = await spawnAsync("code", [buildString]);
        toast({
          title: "Opening Vs Code",
          status: "success",
          duration: 7000,
          position: "top",
          isClosable: true,
        });
        return stdout;
      } catch (error) {
        throw new Error(error);
      }
    }
  }
}

// export const ProjectStoreContext = createContext(new ProjectsStore())
