import { RootStore } from "./RootStore";
import { action, observable, makeObservable, computed } from "mobx";
import { persist } from "mobx-persist";
import { createStandaloneToast } from "@chakra-ui/react";

const toast = createStandaloneToast();
const WINDOWS_IP = "windowsIp";
export class MacStore {
  rootStore: RootStore;
  store: any;
  constructor(rootStore: RootStore, store: any) {
    makeObservable(this);
    this.store = store;
    this.rootStore = rootStore;
    this.windowsIp = this.store.get(WINDOWS_IP);
  }
  @persist @observable windowsIp = "";

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
}
