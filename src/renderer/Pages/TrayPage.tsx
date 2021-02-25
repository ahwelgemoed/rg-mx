import React, { useContext, useEffect } from 'react'
import {
  Tabs,
  TabList,
  IconButton,
  Button,
  TabPanels,
  Skeleton,
  Tab,
  Stack,
  Image,
  ButtonGroup,
  Box,
  Badge,
  TabPanel,
  Heading,
  createStandaloneToast
} from '@chakra-ui/react'
import { MdComputer } from 'react-icons/md'
import { MainMessages } from '../../socketMessages'
import { CloseIcon, RepeatIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSocket } from '../utils/socketHelpers'
import { observer } from 'mobx-react-lite'
import { RootStoreContext } from '../stores/RootStore'
import ListOfProjects from '../Components/ListOfProjects'
import { TrayAppSettings } from '../Components/TrayAppSettings'
import Simulator from '../Components/Simulator'
import Widgets from '../Components/Widgets'
import GistBoard from '../Components/GistBoard'
import icon from '../assets/Icon-128.png'
import { useHistory } from 'react-router-dom'
import fixPath from 'fix-path'
import { ipcRenderer } from 'electron'
import pF from 'os'

const { getCurrentWindow } = require('electron').remote
const spawn = require('child_process').spawn

const platform = pF.platform()
const toast = createStandaloneToast()
const TrayPage = observer(() => {
  platform === 'darwin' && fixPath() // Super important for MAC Path Fixes
  const history = useHistory()
  const mainStore = useContext(RootStoreContext)
  const {
    isSocketConnected,
    socketProjects,
    sendOpenStudioInProject,
    sendOpenInCMD,
    clientOnline
  } = useSocket({
    windowsIp: mainStore.macStore.windowsIp
  })
  useEffect(() => {
    clientOnline()
  }, [])

  const openInMacTerminal = (projectName: string) => {
    const projectPath = `${mainStore.macStore.macProjectsPath}/${projectName}`
    const openMX = spawn('open', ['-a', 'Terminal', projectPath])
    openMX.stderr.on('data', (data: any) => {
      toast({
        status: 'error',
        title: 'Error',
        description: `${data}`,
        duration: 7000,
        position: 'top',
        isClosable: true
      })
    })
    openMX.on('close', (code: any) => {
      if (!code) {
        toast({
          title: `Opening ${projectName} - Terminal`,
          status: 'success',
          duration: 7000,
          position: 'top',
          isClosable: true
        })
      }
    })
  }
  const openProjectInVSCodeMacBase = (projectName: string) => {
    const projectPath = `${mainStore.macStore.macProjectsPath}/${projectName}`
    const openMX = spawn('code', [projectPath], { stdio: 'inherit' })
    openMX.stderr.on('data', (data: any) => {
      toast({
        status: 'error',
        title: 'Error',
        description: `${data}`,
        duration: 7000,
        position: 'top',
        isClosable: true
      })
    })
    openMX.on('close', (code: any) => {
      if (!code) {
        toast({
          title: `Opening ${projectName} - Base`,
          status: 'success',
          duration: 7000,
          position: 'top',
          isClosable: true
        })
      }
    })
  }
  const openProjectInVSCodeMacStyles = (projectName: string) => {
    const projectPath = `${mainStore.macStore.macProjectsPath}/${projectName}/theme/styles`
    const openMX = spawn('code', [projectPath])
    // const ls = spawn('ls', ['-lh', '/usr']);
    openMX.stderr.on('data', (data: any) => {
      console.log('data', data)
      toast({
        status: 'error',
        title: 'Error',
        description: `${data}`,
        duration: 7000,
        position: 'top',
        isClosable: true
      })
    })
    openMX.on('close', (code: any) => {
      if (!code) {
        toast({
          title: `Opening ${projectName} - Styles`,
          status: 'success',
          duration: 7000,
          position: 'top',
          isClosable: true
        })
      }
    })
  }
  const startParallelsAndWindows = () => {
    const openMX = spawn('open', ['-a', 'Parallels Desktop'], {
      stdio: 'inherit'
    })
    openMX.on('close', (code: any) => {
      if (!code) {
        toast({
          title: 'Opening Parallels Desktop',
          status: 'success',
          duration: 7000,
          position: 'top',
          isClosable: true
        })
      }
    })
  }

  return (
    <Box p="4">
      <Stack direction="row" spacing={6} justify="space-between">
        <Stack direction="row" alignItems="center">
          <Image boxSize="80px" src={icon} alt="RG_MX" />
          <Stack direction="column" mb="4">
            <Heading>RG-MX</Heading>
            <Badge
              colorScheme={isSocketConnected ? 'teal' : 'red'}
              borderRadius="5px"
            >
              {isSocketConnected
                ? 'Windows Is Connected'
                : 'Windows Is Offline'}
            </Badge>
          </Stack>
        </Stack>
        <ButtonGroup size="sm" isAttached>
          <TrayAppSettings />

          <IconButton
            colorScheme="yellow"
            size="xs"
            variant="outline"
            aria-label="reload"
            onClick={() => startParallelsAndWindows()}
            icon={<MdComputer />}
          />
          <IconButton
            colorScheme="teal"
            size="xs"
            aria-label="reload"
            onClick={() => getCurrentWindow().reload()}
            icon={<RepeatIcon />}
          />
          <IconButton
            size="xs"
            colorScheme="red"
            onClick={() => ipcRenderer.send(MainMessages.CLOSE_APP)}
            aria-label="close"
            icon={<CloseIcon />}
          />
        </ButtonGroup>
      </Stack>
      <Tabs variant="enclosed" colorScheme="teal">
        <TabList>
          <Tab isDisabled={!isSocketConnected}>Projects</Tab>
          <Tab>Widgets</Tab>
          <Tab>Simulator</Tab>
          <Tab>Gists</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {isSocketConnected ? (
              <ListOfProjects
                projectsSorted={
                  // @ts-ignore
                  socketProjects && JSON.parse(socketProjects.messageBody)
                }
                openStudioInProject={sendOpenStudioInProject}
                openInVsCodeBase={openProjectInVSCodeMacBase}
                openInVsCodeStyles={openProjectInVSCodeMacStyles}
                openInMacTerminal={openInMacTerminal}
                openInWindowsTerminal={sendOpenInCMD}
              />
            ) : (
              <>
                <Skeleton height="20px" mb="4" />
                <Skeleton height="20px" mb="4" />
                <Skeleton height="20px" mb="4" />
              </>
            )}
          </TabPanel>
          <TabPanel>
            <Widgets />
          </TabPanel>
          <TabPanel>
            <Simulator />
          </TabPanel>
          <TabPanel>
            <GistBoard ghUserName={mainStore.macStore.githubUsername} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
})

export default TrayPage
