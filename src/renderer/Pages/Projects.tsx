import React, { useEffect, useContext } from 'react'

import {
  Heading,
  Stack,
  ButtonGroup,
  Tag,
  TagLabel,
  Divider,
  Text,
  Box
} from '@chakra-ui/react'
import { useSocket } from '../utils/socketHelpers'
import ListOfProjects from '../Components/ListOfProjects'
import { AddProjectListModal } from '../Components/AddProjectListModal'
import { ParallelsSettings } from '../Components/ParallelsSettings'
import { RootStoreContext } from '../stores/RootStore'
import { observer } from 'mobx-react-lite'

import { FolderNamesType, ProjectType } from '../types/projectTypes'

const Projects: React.FC = observer(() => {
  const {
    sendProjects,
    sendOpenStudioInProject,
    openProjectInStudio
  } = useSocket()
  const projectStore = useContext(RootStoreContext)
  useEffect(() => {
    const interval = setInterval(() => {
      sendProjects(projectStore.projectsStore.projectsSorted)
      sendOpenStudioInProject(projectStore.projectsStore.openStudioInProject)
      // sendOpenInVsCode(projectStore.projectsStore.openInVsCode)
    }, 5000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    console.log('openProjectInStudio', )
    if(openProjectInStudio){
      // @ts-ignore
      opneThisProjectInStudio(JSON.parse(openProjectInStudio.body))
    }
  }, [openProjectInStudio])

  const opneThisProjectInStudio = (path: string) => {
    // console.log('opneThisProjectInStudio', e)
    // console.log('{projectStore.projectsStore.mendixProjectsPathMac', projectStore.projectsStore.mendixProjectsPathMac)
    projectStore.projectsStore.openStudioInProject(path, projectStore.projectsStore.mendixProjectsPathMac)
  }
  return (
    <div>
      <Stack direction="row" spacing={6} justify="space-between">
        <Box maxW="32rem">
          <Heading mb={4}> Projects</Heading>
          <Text fontSize="xl">
            <Tag size="sm" colorScheme="cyan" borderRadius="full">
              <TagLabel>
                {projectStore.projectsStore.mendixProjectsPathMac
                  ? projectStore.projectsStore.mendixProjectsPathMac
                  : 'No Apps Folder'}
              </TagLabel>
            </Tag>
          </Text>
        </Box>
        <ButtonGroup size="sm" isAttached variant="outline">
          <ParallelsSettings />
          <AddProjectListModal />
        </ButtonGroup>
      </Stack>
      <ListOfProjects
        projectsSorted={projectStore.projectsStore.projectsSorted}
        openStudioInProject={opneThisProjectInStudio}
        openInVsCode={projectStore.projectsStore.openInVsCode}
      />
    </div>
  )
})

export default Projects
