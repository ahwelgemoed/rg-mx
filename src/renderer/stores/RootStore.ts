import { createContext } from "react";
import { MacStore } from "./MacStore";
import { ProjectsStore } from "./ProjectsStore";
import { create, persist } from "mobx-persist";

import { remote } from "electron";

const ElectronStorage = remote.require("electron-store");

const hydrate = create({
  storage: localStorage,
  jsonify: false,
});
export class RootStore {
  store: any = new ElectronStorage();
  constructor() {
    hydrate("projectsStore", this.projectsStore);
    hydrate("macStore", this.macStore);
  }

  projectsStore = new ProjectsStore(this, this.store);
  macStore = new MacStore(this, this.store);
}

export const RootStoreContext = createContext(new RootStore());
