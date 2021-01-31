import { RootStore } from './RootStore'
import { action, observable, makeObservable, computed } from 'mobx'
import { persist } from 'mobx-persist'
import fs from 'fs'
import { createStandaloneToast } from '@chakra-ui/react'

import { FolderNamesType, ProjectType } from '../types/projectTypes'
const { spawn } = require('child_process')
const toast = createStandaloneToast()

const PROJECTS_SORTED = 'projects_Sorted'
const GULP_SORTED = 'gulpPath'

export class ProjectsStore {
  rootStore: RootStore;
  store: any;
  constructor(rootStore: RootStore, store: any) {
    makeObservable(this)
    this.store = store
    this.rootStore = rootStore
    this.projectsPath = this.store.get('projectsStore')
    this.gulpPath = this.store.get(GULP_SORTED)
    this.projectsSorted = this.store.get(PROJECTS_SORTED)
  }

  checkForMPR = (name: string): boolean => {
    return !name.includes('_') && name.substr(name.length - 4) == '.mpr'
  };

  @persist @observable projectsPath = '';
  @persist @observable gulpPath = '';
  @observable projectLoading = false;
  @persist @observable projectsSorted: ProjectType[] = [];

  @action setGulpPath(stringPath: string) {
    this.gulpPath = stringPath
    this.store.set(GULP_SORTED, this.gulpPath)
    toast({
      title: 'Gulp Folder Location Added',
      status: 'success',
      duration: 5000,
      position: 'top',
      isClosable: true
    })
  }

  @action setProjectPath(stringPath: string) {
    this.projectsPath = stringPath
    this.store.set('projectsStore', this.projectsPath)
    toast({
      title: 'Projects Folder Added',
      status: 'success',
      duration: 5000,
      position: 'top',
      isClosable: true
    })
  }

  @action setLoading(value: boolean) {
    return (this.projectLoading = value)
  }

  @action setSortedProjects() {
    this.setLoading(true)
    setTimeout(() => {
      let sortableUnq: string[] = ['']
      console.log('this.projectsPath', this.projectsPath)
      if (!this.projectsPath) {
        this.setLoading(false)
        toast({
          title: 'No Projects Folder Specified',
          status: 'error',
          duration: 5000,
          position: 'top',
          isClosable: true
        })
      }
      // console.log("this.projectsPath", );
      const rawFiles = fs.readdirSync(this.projectsPath)
      rawFiles.forEach((file) => {
        const PROJECT_PATH = `${this.projectsPath}/${file}`
        // If Directory
        if (fs.lstatSync(PROJECT_PATH).isDirectory()) {
          const branshFiels = fs.readdirSync(PROJECT_PATH)
          branshFiels.map((files) => {
            if (this.checkForMPR(files)) {
              const splitNameArray = file.split('-')
              sortableUnq.push(splitNameArray[0])
            }
          })
        }
      })
      sortableUnq = [...new Set(sortableUnq)]
      // Sort and Group Projects
      const sortedList: any[] = sortableUnq.reduce((a: any[], c: string) => {
        const foundNames: FolderNamesType[] = []
        rawFiles.forEach((name) => {
          const PROJECT_PATH = `${this.projectsPath}/${name}`
          if (!name.startsWith('.')) {
            if (fs.lstatSync(PROJECT_PATH).isDirectory()) {
              const branshFiels = fs.readdirSync(PROJECT_PATH)
              branshFiels.map((files) => {
                if (this.checkForMPR(files)) {
                  const stats = fs.statSync(`${PROJECT_PATH}/${files}`)
                  if (c && name.includes(c)) {
                    return foundNames.push({
                      name,
                      lastModified: stats.mtime
                    })
                  }
                }
              })
            }
          }
        })
        if (!c) {
          return a
        }
        return [...a, { name: c, folderNames: foundNames }]
      }, [])
      const dateSortedList: ProjectType[] = [];
      (sortedList as ProjectType[]).forEach((x) => {
        x.folderNames.sort(function (a: FolderNamesType, b: FolderNamesType) {
          return (
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
          )
        })
        dateSortedList.push({
          ...x,
          lastModified: x.folderNames[0].lastModified
        })
      })
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      this.projectsSorted = dateSortedList
      this.store.set(PROJECTS_SORTED, this.projectsSorted)
      toast({
        title: `${sortedList.length} Projects added`,
        status: 'success',
        duration: 7000,
        position: 'top',
        isClosable: true
      })
      this.setLoading(false)
    }, 100)
  }

  @action openStudioInProject(projectName: string) {
    const buildString = `${this.projectsPath}/${projectName}`
    const branshFiels = fs.readdirSync(buildString)
    let fileToOpen
    branshFiels.map((files) => {
      if (this.checkForMPR(files)) {
        fileToOpen = files
      }
    })
    const fileStringToOpen = `${buildString}/${fileToOpen}`
    const ls = spawn('open', [fileStringToOpen])
    // const ls = spawn('ls', ['-lh', '/usr']);
    ls.stderr.on('data', (data: any) => {
      toast({
        status: 'error',
        title: 'Error',
        description: `${data}`,
        duration: 7000,
        position: 'top',
        isClosable: true
      })
    })
    ls.on('close', (code: any) => {
      if (!code) {
        toast({
          title: 'Opening Mendix Studio',
          status: 'success',
          duration: 7000,
          position: 'top',
          isClosable: true
        })
      }
    })
  }
}

// export const ProjectStoreContext = createContext(new ProjectsStore())
