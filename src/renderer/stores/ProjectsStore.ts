import { RootStore } from './RootStore'
import { action, observable, makeObservable, computed } from 'mobx'
import { persist } from 'mobx-persist'

export class ProjectsStore {
  rootStore: RootStore;
  store: any;
  constructor(rootStore: RootStore, store: any) {
    makeObservable(this)
    this.store = store
    this.rootStore = rootStore
    this.projectsPath = this.store.get('projectsStore')
  }

  @persist @observable projectsPath = '';

  @action setProjectPath(stringPath: string) {
    console.log(this.projectsPath)
    this.projectsPath = stringPath
    this.store.set('projectsStore', this.projectsPath)
  }
}

// export const ProjectStoreContext = createContext(new ProjectsStore())
