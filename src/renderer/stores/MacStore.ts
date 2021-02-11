import { RootStore } from "./RootStore";
import { action, observable, makeObservable, computed } from "mobx";
import { persist } from "mobx-persist";
import { createStandaloneToast } from "@chakra-ui/react";

const toast = createStandaloneToast();
const WINDOWS_IP = "windowsIp";
const MAC_PROJECTS_PATH = "macProjectsPath";
export class MacStore {
  rootStore: RootStore;
  store: any;
  constructor(rootStore: RootStore, store: any) {
    makeObservable(this);
    this.store = store;
    this.rootStore = rootStore;
    this.windowsIp = this.store.get(WINDOWS_IP);
    this.macProjectsPath = this.store.get(MAC_PROJECTS_PATH);
  }
  @persist @observable windowsIp = "";
  @persist @observable macProjectsPath = "";

  @action setWindowsIp(stringPath: string) {
    this.windowsIp = stringPath;
    this.store.set(WINDOWS_IP, this.windowsIp);
    toast({
      title: "Windows IP Saved",
      status: "success",
      duration: 5000,
      position: "top",
      isClosable: true,
    });
  }
  @action setMacProjectsPath(stringPath: string) {
    this.macProjectsPath = stringPath;
    this.store.set(MAC_PROJECTS_PATH, this.macProjectsPath);
    toast({
      title: "Path To Mendix Projects Saved",
      status: "success",
      duration: 5000,
      position: "top",
      isClosable: true,
    });
  }
}
