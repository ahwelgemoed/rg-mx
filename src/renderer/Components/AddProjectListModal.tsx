import React from "react";

import {
  Stack,
  Button,
  Modal,
  Tag,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Radio,
  RadioGroup,
  Divider,
  Heading,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { RootStoreContext } from "../stores/RootStore";
import { observer } from "mobx-react-lite";
import { FolderSortEnum } from "../types/projectTypes";
const platform = require("os").platform();
const slash = platform === "darwin" ? "/" : "\\";
export const AddProjectListModal: React.FC = observer(({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [folderSort, setFolderSort] = React.useState<FolderSortEnum>(
    FolderSortEnum.Smart
  );
  const projectStore = React.useContext(RootStoreContext);
  const [mendixAppsPath, setMendixAppsPath] = React.useState<
    string | undefined
  >();
  React.useEffect(() => {
    if (projectStore.projectsStore.mendixProjectsPathMac) {
      setMendixAppsPath(projectStore.projectsStore.mendixProjectsPathMac);
      if (projectStore.projectsStore.sortOption) {
        setFolderSort(projectStore.projectsStore.sortOption);
      } else {
        setFolderSort(FolderSortEnum.Smart);
      }
    } else {
      onOpen();
    }
  }, []);
  const locateGulpFile = (event: any) => {
    if (event.target.files[0]) {
      const pathToGulp = event.target.files[0].path;
    }
  };
  const locateMendixAppsPath = (event: any) => {
    if (event.target.files[0]) {
      const pathToThisMendixProject = event.target.files[0].path;
      const split = pathToThisMendixProject.split(slash);
      split.splice(split.length - 2, 2);
      const joinMendixPath = split.join(slash);
      setMendixAppsPath(joinMendixPath);
    }
  };
  const setAndSave = (e: FolderSortEnum) => {
    setFolderSort(e);
    projectStore.projectsStore.setSortPath(e);
  };
  const acceptAndAddProjects = () => {
    if (mendixAppsPath) {
      // Set Project Path To Mem
      projectStore.projectsStore.setProjectPath(mendixAppsPath);
      projectStore.projectsStore.setSortedProjects(folderSort);
      onClose();
    }
  };
  const displayMendixPath = () => {
    if (mendixAppsPath) {
      return (
        <>
          Is this the Path To all Your Mendix Apps?:
          <Tag>{mendixAppsPath}</Tag>
        </>
      );
    }
  };
  return (
    <>
      <Button mr="-px" colorScheme="teal" onClick={onOpen}>
        <SettingsIcon size="xs" />
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack pt={3} spacing={4} align="stretch">
              <Heading size="md" mb={4}>
                Choose the .mpr file in any Mendix App in your Mendix Apps
                folder:
              </Heading>

              <Button onChange={locateMendixAppsPath}>
                <label className="custom-file-upload">
                  <input
                    id="path-picker"
                    type="file"
                    // @ts-ignore
                    //   webkitdirectory="true"
                  />
                  Choose Mendix Folder Path
                </label>
              </Button>
              <Stack spacing={4} align="stretch">
                {displayMendixPath()}
              </Stack>

              <Divider />
              <Heading size="md">Display Options</Heading>
              <RadioGroup
                mb={4}
                size="sm"
                colorScheme="teal"
                // @ts-ignore
                onChange={setAndSave}
                value={folderSort}
              >
                <Stack direction="row">
                  <Radio value={FolderSortEnum.Smart}>Smart Collect</Radio>
                  <Radio isDisabled value={FolderSortEnum.Sub}>
                    Sub Folder
                  </Radio>
                  <Radio value={FolderSortEnum.Plain}>Plain</Radio>
                </Stack>
              </RadioGroup>
            </Stack>
          </ModalBody>
          {mendixAppsPath && (
            <ModalFooter>
              <Button colorScheme="teal" onClick={acceptAndAddProjects}>
                Save
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});
