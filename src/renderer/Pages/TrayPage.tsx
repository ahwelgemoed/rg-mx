import React, { useContext } from 'react'
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  Stack,
  ButtonGroup,
  Box,
  Badge,
  TabPanel,
  Heading
} from '@chakra-ui/react'
import { useSocket } from '../utils/socketHelpers'
import { RootStoreContext } from '../stores/RootStore'
import ListOfProjects from '../Components/ListOfProjects'
import { AddProjectListModal } from '../Components/AddProjectListModal'
const TrayPage = () => {
  const { isSocketConnected, socketProjects } = useSocket()
  const projectStore = useContext(RootStoreContext)
  return (
    <Box p="4">
      <Stack direction="row" spacing={6} justify="space-between">
        <Heading mb={4}>
          Mendid-X{' '}
          <Badge colorScheme={isSocketConnected ? 'teal' : 'red'}>
            {isSocketConnected ? 'Connected' : 'Windows Offline'}
          </Badge>
        </Heading>
        <ButtonGroup size="sm" isAttached variant="outline">
          <AddProjectListModal />
        </ButtonGroup>
      </Stack>
      <Tabs>
        <TabList>
          <Tab isDisabled={!isSocketConnected}>Projects</Tab>
          <Tab>Simulator</Tab>
          <Tab>ClipBoard</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ListOfProjects
              projectsSorted={
                // @ts-ignore
                socketProjects && JSON.parse(socketProjects.messageBody)
              }
              openStudioInProject={
                projectStore.projectsStore.openStudioInProject
              }
              openInVsCode={projectStore.projectsStore.openInVsCode}
            />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default TrayPage
