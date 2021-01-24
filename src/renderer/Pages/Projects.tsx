import React, { useState, useContext } from 'react'
import {
  Heading,
  Stack,
  ButtonGroup,
  Button,
  Tag,
  TagLabel,
  Divider,
  useDisclosure
} from '@chakra-ui/react'
import { AddProjectListModal } from './AddProjectListModal'
import { RootStoreContext } from '../stores/RootStore'
import { observer } from 'mobx-react-lite'

const Projects: React.FC = observer(() => {
  const projectStore = useContext(RootStoreContext)

  const PROJECTS_FOLDER_PATH = 'ls'

  return (
    <div>
      <Stack direction="row" spacing={6} justify="space-between">
        <Heading as="h2" size="xl">
          Projects
          <Tag size="sm" colorScheme="cyan" borderRadius="full">
            <TagLabel>
              {projectStore.projectsStore.projectsPath
                ? projectStore.projectsStore.projectsPath
                : 'No Apps Folder'}
            </TagLabel>
          </Tag>
        </Heading>
        <ButtonGroup size="sm" isAttached variant="outline">
          <AddProjectListModal />
        </ButtonGroup>
      </Stack>
      <Divider orientation="horizontal" />
    </div>
  )
})

export default Projects
