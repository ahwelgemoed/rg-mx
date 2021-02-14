import spawnAsync from '@expo/spawn-async'
import { exec } from 'child_process'
import path from 'path'
import { dataPath } from '../utils'
import { createStandaloneToast } from '@chakra-ui/react'
import icon from '../assets/Icon-128.png'
const electron = require('electron')
const spawn = require('cross-spawn')

const toast = createStandaloneToast()
export const witchSimulatorIsInstalled = async () => {
  try {
    const { stdout } = await spawnAsync('emulator', ['-list-avds'], {
      env: {
        NODE_ENV: 'production',
        PATH: process.env.PATH
      }
    })

    return stdout
  } catch (error) {
    toast({
      status: 'error',
      title: 'Error',
      description: 'Cant Find Installed Android Sims',
      duration: 7000,
      position: 'top',
      isClosable: true
    })
    throw new Error(error)
  }
}

export const startupSimulator = async (selectedDevice: string) => {
  toast({
    status: 'success',
    title: 'Starting Up',
    description: `${selectedDevice}`,
    duration: 7000,
    position: 'top',
    isClosable: true
  })
  exec(`emulator -avd ${selectedDevice}`, (err, stdout, stderr) => {
    // if (err) {
    //   console.log("err", err);
    //   toast({
    //     status: "error",
    //     title: "Error",
    //     description: `Android Sim Not Started`,
    //     duration: 7000,
    //     position: "top",
    //     isClosable: true,
    //   });
    // }
  })
}

export const installMendixApp = async (version: number) => {
  toast({
    status: 'success',
    title: 'Installing',
    description: `Make It Native V${version}`,
    duration: 7000,
    position: 'top',
    isClosable: true
  })
  try {
    if (version === 8) {
      for (let index = 1; index < 5; index++) {
        const { stdout } = await spawnAsync('adb', [
          'install-multiple',
          getApk8(index)
        ])
        return stdout
      }
    }
    if (version === 9) {
      const { stdout } = await spawnAsync('adb', [
        'install-multiple',
        getIDofApk()
      ])
      return stdout
    }
  } catch (error) {
    console.log('error', error)
    throw new Error(error)
  }
}
const getApk8 = (name: number): string => {
  return `${dataPath}/mx8/${name}.apk`
}
const getIDofApk = (): string => {
  return `${dataPath}/mx9/min9.apk`
}

export const openMendixApp = async (installedAppName: string) => {
  const openAppSusses = new electron.remote.Notification({
    title: 'Opened',
    body: 'Make it Native Has Been Opened',
    silent: true,
    icon: icon
  })
  openAppSusses.show()
  // toast({
  //   status: "success",
  //   title: "Opening",
  //   description: `${installedAppName}`,
  //   duration: 7000,
  //   position: "top",
  //   isClosable: true,
  // });
  try {
    const { stdout } = await spawnAsync('adb', [
      'shell',
      'monkey',
      `-p ${installedAppName}`,
      '-v 1'
    ])
    return stdout
  } catch (error) {
    toast({
      status: 'error',
      title: 'Error',
      description: `${error}`,
      duration: 7000,
      position: 'top',
      isClosable: true
    })
    // openMendixAppSpinner.fail("Mendix App could not be Opened");
    throw new Error(error)
  }
}

export const listAllAppsOnDevice = async (version: number) => {
  try {
    //   package:com.mendix.developerapp
    const { stdout } = await spawnAsync('adb', ['shell', 'pm list packages'])
    const allApps = stdout.split('\n').find((x) => {
      if (x.includes('mendix')) {
        if (version === 9 && x.includes('mx9')) {
          return x
        }
        if (version === 8 && !x.includes('mx9')) {
          return x
        }
      }
    })
    if (allApps) {
      return allApps.split('package:')[1]
    } else {
      return false
    }
  } catch (error) {
    console.log('error', error)
  }
}

export const checkIfBootHasCompleted = async () => {
  try {
    const result = await spawnAsync('adb', [
      'shell',
      'am broadcast',
      '-a android.intent.action.ACTION_BOOT_COMPLETED'
    ])
    return result
  } catch (error) {
    return error
  }
}
