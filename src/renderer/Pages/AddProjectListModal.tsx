import React from 'react'

import {
  Stack,
  Button,
  Modal,
  Tag,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { AttachmentIcon } from '@chakra-ui/icons'
import { RootStoreContext } from '../stores/RootStore'
import { observer } from 'mobx-react-lite'

export const AddProjectListModal: React.FC = observer(({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const projectStore = React.useContext(RootStoreContext)
  const [mendixAppsPath, setMendixAppsPath] = React.useState<
    string | undefined
  >()

  React.useEffect(() => {
    setMendixAppsPath(projectStore.projectsStore.projectsPath)
  }, [])
  const locateMendixAppsPath = (event: any) => {
    if (event.target.files[0]) {
      const pathToThisMedixProject = event.target.files[0].path
      const split = pathToThisMedixProject.split('/')
      split.splice(split.length - 2, 2)
      const joinMendixPath = split.join('/')
      setMendixAppsPath(joinMendixPath)
    }
  }

  const acceptAndAddProjects = () => {
    if (mendixAppsPath) {
      // Set Project Path To Mem
      projectStore.projectsStore.setProjectPath(mendixAppsPath)
      projectStore.projectsStore.setSortedProjects()
      onClose()
    }
  }
  const displayMendixPath = () => {
    if (mendixAppsPath) {
      return (
        <>
          Is this the Path To all Your Mendix Apps?:
          <Tag>{mendixAppsPath}</Tag>
        </>
      )
    }
  }
  return (
    <>
      <Button mr="-px" onClick={onOpen}>
        <AttachmentIcon size="xs" /> Mendix Apps Folder
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose Folder</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Choose the .mrp file in any Mendix App in your Mendix Apps folder:
            <Stack pt={3} spacing={4} align="stretch">
              <Button onChange={locateMendixAppsPath}>
                <label className="custom-file-upload">
                  <input
                    id="path-picker"
                    type="file"
                    // @ts-ignore
                    //   webkitdirectory="true"
                  />
                  Choose Folder Path
                </label>
              </Button>
              <Stack spacing={4} align="stretch">
                {displayMendixPath()}
              </Stack>
            </Stack>
          </ModalBody>
          {mendixAppsPath && (
            <ModalFooter>
              <Button colorScheme="cyan" onClick={acceptAndAddProjects}>
                Save
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  )
})
