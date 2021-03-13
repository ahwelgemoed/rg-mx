import React, { useEffect, useState } from 'react'
import {
  Heading,
  Button,
  Box,
  Stack,
  ButtonGroup,
  Spacer,
  List,
  Link,
  ListItem,
  Divider
} from '@chakra-ui/react'
import fs from 'fs'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { dataPath } from '../utils'
import {
  witchSimulatorIsInstalled,
  startupSimulator,
  listAllAppsOnDevice,
  installMendixApp,
  downloadMendixApps,
  checkIfBootHasCompleted,
  openMendixApp
} from '../utils/androidSimulator'
import axios from 'axios'
const { shell } = require('electron')

const Simulator = () => {
  const [listOfSims, setListOfSims] = useState<string[] | null>(null)
  useEffect(() => {
    (async function anyNameFunction() {
      await listOfandroidSim()
    })()
  }, [])

  const listOfandroidSim = async () => {
    const witchSim = await witchSimulatorIsInstalled()
    const rationalList = witchSim.split('\n').filter(Boolean)
    setListOfSims(rationalList)
  }

  const startSelectedDevice = async (deviceToBoot: string, version: number) => {
    const status = await startupSimulator(deviceToBoot)
    let deviceBooted = false
    do {
      const result = await checkIfBootHasCompleted()
      if (result) {
        if (result.status === 0) {
          deviceBooted = true
        }
      }
    } while (!deviceBooted)
    if (deviceBooted) {
      const installedAppName = await listAllAppsOnDevice(version)
      if (installedAppName) {
        // MX INSTALLED
        installedAppName && (await openMendixApp(installedAppName))
      }
      if (!installedAppName) {
        await downloadMendixApps(version)
        // MX MUST BE INSTALLED
        await setTimeout(async () => {
          const installedSuccess = await installMendixApp(version)
          if (installedSuccess && installedSuccess.includes('Success')) {
            const getNameOfInstalledApp = await listAllAppsOnDevice(version)
            getNameOfInstalledApp &&
              (await openMendixApp(getNameOfInstalledApp))
          }
        }, 5000)
      }
    }
  }

  return (
    <div>
      <Stack mb={4}>
        <Heading>All Installed Android Simulators</Heading>
        <Heading as="h6" size="xs">
          Here is a list of all your installed Android Simulators. Clicking on
          the buttons will open the simulator and install the respective Mendix
          App.
        </Heading>
        <Heading as="h6" size="xs">
          <Link
            isExternal
            onClick={() =>
              shell.openExternal(
                'https://reactnative.dev/docs/environment-setup#installing-dependencies'
              )
            }
          >
            Read Here How to Setup <ExternalLinkIcon mx="2px" />
          </Link>
        </Heading>
      </Stack>
      {!listOfSims ? (
        <Heading size="sm" mb={4}>
          No Android Simulators Installed
        </Heading>
      ) : (
        <List spacing={3}>
          {listOfSims.map((item, i) => {
            return (
              <div key={i * 12}>
                <Stack direction="row" spacing={6} justify="space-between">
                  <Box mr="2">
                    <ListItem>{item.replace(/_/g, ' ')}</ListItem>
                  </Box>
                  <Box>
                    <ButtonGroup size="sm" isAttached>
                      <Button
                        colorScheme="teal"
                        size="xs"
                        //   variant="outline"
                        onClick={() => startSelectedDevice(item, 8)}
                      >
                        Mendix 8
                      </Button>
                      <Button
                        colorScheme="teal"
                        size="xs"
                        variant="outline"
                        onClick={() => startSelectedDevice(item, 9)}
                      >
                        Mendix 9
                      </Button>
                    </ButtonGroup>
                  </Box>
                </Stack>
                <Spacer />
                <Divider />
              </div>
            )
          })}
        </List>
      )}
    </div>
  )
}

export default Simulator
