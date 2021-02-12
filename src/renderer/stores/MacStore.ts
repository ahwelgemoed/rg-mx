import { RootStore } from './RootStore'
import { action, observable, makeObservable, computed } from 'mobx'
import { persist } from 'mobx-persist'
import { createStandaloneToast } from '@chakra-ui/react'

const toast = createStandaloneToast()
const WINDOWS_IP = 'windowsIp'
const GITHUB_USER_NAME = 'githubUserName'
const MAC_WIDGETS_PATH = 'macWidgetsPath'
const MAC_PROJECTS_PATH = 'macProjectsPath'
export class MacStore {
  rootStore: RootStore;
  store: any;
  constructor(rootStore: RootStore, store: any) {
    makeObservable(this)
    this.store = store
    this.rootStore = rootStore
    this.windowsIp = this.store.get(WINDOWS_IP)
    this.githubUsername = this.store.get(GITHUB_USER_NAME)
    this.macWidgetsPath = this.store.get(MAC_WIDGETS_PATH)
    this.macProjectsPath = this.store.get(MAC_PROJECTS_PATH)
  }

  @persist @observable windowsIp = '';
  @persist @observable githubUsername = '';
  @persist @observable macWidgetsPath = '';
  @persist @observable macProjectsPath = '';

  @action setWindowsIp(stringPath: string) {
    this.windowsIp = stringPath
    this.store.set(WINDOWS_IP, this.windowsIp)
    toast({
      title: 'Windows IP Saved',
      status: 'success',
      duration: 5000,
      position: 'top',
      isClosable: true
    })
  }

  @action setMacWidgetsPath(stringPath: string) {
    this.macWidgetsPath = stringPath
    this.store.set(MAC_WIDGETS_PATH, this.macWidgetsPath)
    toast({
      title: 'Path To Widgets Saved',
      status: 'success',
      duration: 5000,
      position: 'top',
      isClosable: true
    })
  }

  @action setMacProjectsPath(stringPath: string) {
    this.macProjectsPath = stringPath
    this.store.set(MAC_PROJECTS_PATH, this.macProjectsPath)
    toast({
      title: 'Path To Mendix Projects Saved',
      status: 'success',
      duration: 5000,
      position: 'top',
      isClosable: true
    })
  }

  @action setGithubName(stringPath: string) {
    if (stringPath) {
      this.githubUsername = stringPath
      this.store.set(GITHUB_USER_NAME, this.githubUsername)
      toast({
        title: 'Github User Name Saved',
        status: 'success',
        duration: 5000,
        position: 'top',
        isClosable: true
      })
    }
  }
}
