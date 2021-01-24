import { RootStore } from "./RootStore";
import { action, observable, makeObservable, computed } from "mobx";
import { persist } from "mobx-persist";
const { spawn } = require("child_process");
import fs from "fs";
import { createStandaloneToast } from "@chakra-ui/react";
const toast = createStandaloneToast();

const PROJECTS_SORTED = "projects_Sorted";

export class ProjectsStore {
  rootStore: RootStore;
  store: any;
  constructor(rootStore: RootStore, store: any) {
    makeObservable(this);
    this.store = store;
    this.rootStore = rootStore;
    this.projectsPath = this.store.get("projectsStore");
    this.projectsSorted = this.store.get(PROJECTS_SORTED);
  }

  @persist @observable projectsPath = "";
  @persist @observable projectsSorted = [];

  @action setProjectPath(stringPath: string) {
    console.log(this.projectsPath);
    this.projectsPath = stringPath;
    this.store.set("projectsStore", this.projectsPath);
    toast({
      title: "Projects Folder Added",
      status: "success",
      duration: 5000,
      position: "top",
      isClosable: true,
    });
  }
  @action setSortedProjects() {
    let sortableUnq: string[] = [""];

    const rawFiles = fs.readdirSync(this.projectsPath);

    rawFiles.forEach((file) => {
      const splitNameArray = file.split("-");
      if (splitNameArray.length <= 1) {
        // Un-Sortabile
        console.log("Un-Sortable", splitNameArray);
      } else {
        // Potentially Sortable
        sortableUnq.push(splitNameArray[0]);
        //
      }
    });
    sortableUnq = [...new Set(sortableUnq)];
    // Sort and Group Projects
    const soretedList = sortableUnq.reduce((a: any, c: any) => {
      let foundNames: string[] = [];

      rawFiles.forEach((name) => {
        if (c && name.includes(c)) {
          return foundNames.push(name);
        }
      });
      if (!c) {
        return a;
      }
      return [...a, { name: c, foldedNames: foundNames }];
    }, []);
    this.projectsSorted = soretedList as [];
    this.store.set(PROJECTS_SORTED, this.projectsSorted);
    toast({
      title: `${soretedList.length} Projects added`,
      status: "success",
      duration: 7000,
      position: "top",
      isClosable: true,
    });
  }

  @action openStudioInProject(projectName: string) {
    const buildString = `${this.projectsPath}/${projectName}`;
    const branshFiels = fs.readdirSync(buildString);
    let fileToOpen;
    console.log("buildString", branshFiels);
    branshFiels.map((fiels) => {
      if (!fiels.includes("_") && fiels.substr(fiels.length - 4) == ".mpr") {
        fileToOpen = fiels;
      }
    });
    const fileStringToOpen = `${buildString}/${fileToOpen}`;

    const ls = spawn("open", [fileStringToOpen]);
  }
}

// export const ProjectStoreContext = createContext(new ProjectsStore())
