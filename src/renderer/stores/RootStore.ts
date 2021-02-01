import { createContext } from "react";
import { create, persist } from "mobx-persist";
import { ProjectsStore } from "./ProjectsStore";
import { ServerStore } from "./ServerStore";

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
    hydrate("serverStore", this.serverStore);
  }

  projectsStore = new ProjectsStore(this, this.store);
  serverStore = new ServerStore(this, this.store);
}

export const RootStoreContext = createContext(new RootStore());
