import React, { FunctionComponent } from 'react'
import fs from 'fs'
import {
  Stack,
  Button,
  Modal,
  Heading,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Divider,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { AttachmentIcon } from '@chakra-ui/icons'
import { RootStoreContext } from '../stores/RootStore'
import { observer } from 'mobx-react-lite'
import { dataPath, home } from '../utils'
const { exec, spawn } = require('child_process')

type ExtraTypes = {
  project: any;
};
export const ExtraInfoModal: FunctionComponent<ExtraTypes> = observer(
  ({ project }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const projectStore = React.useContext(RootStoreContext)
    const [loading, setLoading] = React.useState<boolean>(false)

    const setUpGulp = async () => {
      await setLoading(true)
      console.log('dataPath()', `${dataPath}/test.txt`)
      const FULL_PROJECT_PATH = `${projectStore.projectsStore.projectsPath}/${project.name}`
      await fs.copyFile(
        `${dataPath}/Gulpfile.js`,
        `${FULL_PROJECT_PATH}/Gulpfile.js`,
        function (err: any) {
          if (err) {
            setLoading(false)
          } else console.log('Write operation complete.')
        }
      )
      await fs.copyFile(
        `${dataPath}/package.json`,
        `${FULL_PROJECT_PATH}/package.json`,
        function (err: any) {
          if (err) {
            setLoading(false)
          } else console.log('Write operation complete.')
        }
      )
      // @ts-ignore
      // start "" /D F:\- Big Packets -\kitterengine\Common\ /W Template.bat
      const r = fs.readFileSync(`${FULL_PROJECT_PATH}/test.cmd`, 'utf8')
      // console.log("r", FULL_PROJECT_PATH);
      // const ls = spawn("open", [`${FULL_PROJECT_PATH}/test.cmd`]);

      // prlctl exec "Windows 10" "C:\MendixApps\TestLekker\test.cmd"
      // ` start "" /W ${FULL_PROJECT_PATH}/test.cmd`,
      // const ls = spawn("prlctl", [
      //   "exec",
      //   "Windows 10",
      //   // prettier-ignore   "C:\MendixApps\Mendix Design System Workspace-Development Line"
      //   "explorer",
      //   // prettier-ignore
      //   FULL_PROJECT_PATH,
      // ]);
      const ls = spawn('prlctl', [
        'exec',
        'Windows 10',
        'cmd.exe',
        '/k',
        'cd C:\MendixApps\Mendix Design System Workspace-arno-review'
      ])
      // `/k "npm install --prefix C:\MendixApps\Mendix Design System Workspace-main"`,
      // '"my script.cmd"'
      ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
      })

      ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`)
      })

      ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`)
      })

      await setLoading(false)
    }
    return (
      <>
        <Button
          colorScheme="teal"
          variant="ghost"
          size="xs"
          mr="-px"
          onClick={onOpen}
        >
          Options
        </Button>
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Heading size="lg" mb={4}>
                Options for: <b>{project.name}</b>{' '}
              </Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack pt={3} spacing={4} align="stretch">
                <Heading size="md" mb={4}>
                  Setup Gulp in Project:
                </Heading>
                <Button
                  isLoading={loading}
                  colorScheme="cyan"
                  onClick={setUpGulp}
                >
                  Setup Gulp
                </Button>
                <Divider />
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="cyan">Save</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
)
