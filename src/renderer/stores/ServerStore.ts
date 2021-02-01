import { RootStore } from "./RootStore";
import { action, observable, makeObservable, computed } from "mobx";
import { persist } from "mobx-persist";
import fs from "fs";
import { createStandaloneToast } from "@chakra-ui/react";

import { FolderNamesType, ProjectType } from "../types/projectTypes";
const spawn = require("cross-spawn");

const toast = createStandaloneToast();

const PROJECTS_SORTED = "projects_Sorted";
const GULP_SORTED = "gulpPath";

export class ServerStore {
  rootStore: RootStore;
  store: any;
  constructor(rootStore: RootStore, store: any) {
    makeObservable(this);
    this.store = store;
    this.rootStore = rootStore;
  }

  @persist @observable projectsPath = "";
}
