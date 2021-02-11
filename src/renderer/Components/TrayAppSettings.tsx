import React, { useState } from "react";

import {
  Stack,
  Button,
  Modal,
  Input,
  ModalOverlay,
  ModalContent,
  Tag,
  ModalHeader,
  ModalFooter,
  Divider,
  Heading,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { RootStoreContext } from "../stores/RootStore";
import { observer } from "mobx-react-lite";
import { slash } from "../utils";
export const TrayAppSettings: React.FC = observer(({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [windowsIP, setWindowsIP] = useState<string>("");
  const mainStore = React.useContext(RootStoreContext);
  const [mendixAppsPath, setMendixAppsPath] = React.useState<
    string | undefined
  >();

  React.useEffect(() => {
    if (!mainStore.macStore.windowsIp || !mainStore.macStore.macProjectsPath) {
      onOpen();
    }
    setWindowsIP(mainStore.macStore.windowsIp);
    setMendixAppsPath(mainStore.macStore.macProjectsPath);
  }, []);
  const handleChange = (e: any) => {
    setWindowsIP(e.target.value);
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
  const acceptAndAddProjects = () => {
    if (mendixAppsPath) {
      // Set Project Path To Mem
      mainStore.macStore.setWindowsIp(windowsIP);
      mainStore.macStore.setMacProjectsPath(mendixAppsPath);
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
  console.log("mendixAppsPath", mendixAppsPath);
  return (
    <>
      <Button mr="-px" onClick={onOpen}>
        <SettingsIcon size="xs" />
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack pt={3} spacing={4} align="stretch">
              <Heading size="sm">Set Windows IP:</Heading>
              <Input
                variant="outline"
                placeholder="Windows IP"
                value={windowsIP}
                onChange={handleChange}
              />
              <Divider />
              <Heading size="sm">Select Mendix Projects From Mac:</Heading>
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
  );
});
