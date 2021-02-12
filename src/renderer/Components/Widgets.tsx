import React, { useEffect, useState } from 'react'
import fs from 'fs'
import { observer } from 'mobx-react-lite'
import { RootStoreContext } from '../stores/RootStore'
import {
  Heading,
  Button,
  Box,
  Stack,
  ButtonGroup,
  Spacer,
  List,
  ListItem,
  Divider,
  createStandaloneToast
} from '@chakra-ui/react'
const spawn = require('cross-spawn')
const toast = createStandaloneToast()
const Widgets = observer(() => {
  const mainStore = React.useContext(RootStoreContext)
  const [allWidgetState, setAllWidgetState] = useState<any[]>()
  useEffect(() => {
    if (mainStore.macStore.macWidgetsPath) {
      const rawFiles = fs.readdirSync(mainStore.macStore.macWidgetsPath)
      const allWidgets: any[] = []
      rawFiles.forEach((file) => {
        if (!file.startsWith('.')) {
          const stats = fs.statSync(
            `${mainStore.macStore.macWidgetsPath}/${file}`
          )
          allWidgets.push({ name: file, lastModified: stats.mtime })
        }
      })
      const sortingList =
        allWidgets &&
        allWidgets.sort(function (a: any, b: any) {
          return (
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
          )
        })
      setAllWidgetState(sortingList)
    }
  }, [mainStore.macStore.macWidgetsPath])

  const openWidgetInVsCode = (projectName: string) => {
    const projectPath = `${mainStore.macStore.macWidgetsPath}/${projectName}`
    const openMX = spawn('code', [projectPath])
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
          title: `Opening ${projectName} - VS Code`,
          status: 'success',
          duration: 7000,
          position: 'top',
          isClosable: true
        })
      }
    })
  }
  const openWidgetInTerminal = (projectName: string) => {
    const projectPath = `${mainStore.macStore.macWidgetsPath}/${projectName}`
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
  const openWidgetsFolderInTerminal = () => {
    const projectPath = `${mainStore.macStore.macWidgetsPath}`
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
          title: 'Opening Widgets Folder - Terminal',
          status: 'success',
          duration: 7000,
          position: 'top',
          isClosable: true
        })
      }
    })
  }

  return (
    <div>
      <Stack direction="row" spacing={6} justify="space-between">
        <Heading mb={4}>All Widgets</Heading>
        <Button
          colorScheme="teal"
          variant="outline"
          size="xs"
          onClick={() => openWidgetsFolderInTerminal()}
        >
          Folder In Terminal
        </Button>
      </Stack>
      {allWidgetState && allWidgetState.length ? (
        <List spacing={3}>
          {allWidgetState.map((item, i) => {
            return (
              <div key={i * 9999}>
                <Stack
                  key={i * 12}
                  direction="row"
                  spacing={6}
                  justify="space-between"
                >
                  <Box mr="2">
                    <ListItem>{item.name}</ListItem>
                  </Box>
                  <Box>
                    <ButtonGroup size="sm" isAttached>
                      <Button
                        colorScheme="teal"
                        size="xs"
                        //   variant="outline"
                        onClick={() => openWidgetInVsCode(item.name)}
                      >
                        Open VS Code
                      </Button>
                      <Button
                        colorScheme="teal"
                        size="xs"
                        variant="outline"
                        onClick={() => openWidgetInTerminal(item.name)}
                      >
                        Open Terminal
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
      ) : (
        <Heading size="sm" mb={4}>
          No Folders Found
        </Heading>
      )}
    </div>
  )
})

export default Widgets
