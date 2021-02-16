import React, { useState } from "react";
import {
  Stack,
  Button,
  Modal,
  Badge,
  Input,
  ModalOverlay,
  ModalContent,
  Tag,
  IconButton,
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
const { getCurrentWindow } = require("electron").remote;
export const TrayAppSettings: React.FC = observer(({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [windowsIP, setWindowsIP] = useState<string>("");
  const [githubUserName, setGithubUserName] = useState<string>("");
  const mainStore = React.useContext(RootStoreContext);
  const [mendixAppsPath, setMendixAppsPath] = React.useState<
    string | undefined
  >();
  const [mendixWidgetsAppsPath, setMendixWidgetsAppsPath] = React.useState<
    string | undefined
  >("");

  React.useEffect(() => {
    if (!mainStore.macStore.windowsIp || !mainStore.macStore.macProjectsPath) {
      onOpen();
    }

    setWindowsIP(mainStore.macStore.windowsIp);
    setGithubUserName(mainStore.macStore.githubUsername);
    setMendixAppsPath(mainStore.macStore.macProjectsPath);
    setMendixWidgetsAppsPath(mainStore.macStore.macWidgetsPath);
  }, []);
  const handleChange = (e: any) => {
    setWindowsIP(e.target.value);
  };
  const handleGithubChange = (e: any) => {
    setGithubUserName(e.target.value);
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
  const locateWidgetsAppsPath = (event: any) => {
    if (event.target.files[0]) {
      const pathToThisMendixProject = event.target.files[0].path;
      const split = pathToThisMendixProject.split(slash);
      console.log("split", split);
      split.splice(split.length - 2, 2);
      const joinMendixPath = split.join(slash);
      setMendixWidgetsAppsPath(joinMendixPath);
      console.log("joinMendixPath", joinMendixPath);
    }
  };
  const acceptAndAddProjects = () => {
    if (mendixAppsPath && windowsIP) {
      setIsLoading(true);
      mainStore.macStore.setWindowsIp(windowsIP);
      mainStore.macStore.setMacProjectsPath(mendixAppsPath);
      githubUserName && mainStore.macStore.setGithubName(githubUserName);
      mendixWidgetsAppsPath &&
        mainStore.macStore.setMacWidgetsPath(mendixWidgetsAppsPath as string);
      setTimeout(() => {
        getCurrentWindow().reload();
        onClose();
      }, 2500);
    }
  };
  const displayMendixPath = () => {
    if (mendixAppsPath) {
      return (
        <>
          <Tag>{mendixAppsPath}</Tag>
        </>
      );
    }
  };
  const displayWidgetsPath = () => {
    if (mendixWidgetsAppsPath) {
      return (
        <>
          <Tag>{mendixWidgetsAppsPath}</Tag>
        </>
      );
    }
  };
  return (
    <>
      <IconButton
        colorScheme="teal"
        variant="outline"
        size="xs"
        onClick={onOpen}
        aria-label="Call Segun"
        icon={<SettingsIcon />}
      />

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <Divider />
          <ModalCloseButton />
          <ModalBody>
            <Stack pt={3} spacing={4} align="stretch">
              <Heading size="sm">
                <Badge colorScheme="red" mr="2">
                  Mandatory
                </Badge>
                Set Windows IP:
              </Heading>
              <Input
                variant="outline"
                placeholder="Windows IP"
                value={windowsIP}
                onChange={handleChange}
              />
              <Divider />
              <Heading size="sm">
                <Badge colorScheme="red" mr="2">
                  Mandatory
                </Badge>
                Select Mendix Projects From Mac:
              </Heading>
              <Stack spacing={4} align="stretch">
                {displayMendixPath()}
              </Stack>
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
              <Divider />
              <Heading size="sm">
                <Badge colorScheme="teal" mr="2">
                  Optional
                </Badge>
                Select Widgets Folder From Mac:
              </Heading>
              <Stack spacing={4} align="stretch">
                {displayWidgetsPath()}
              </Stack>
              <Button onChange={locateWidgetsAppsPath}>
                <label className="custom-file-upload">
                  <input
                    id="path-picker"
                    type="file"
                    // @ts-ignore
                    //   webkitdirectory="true"
                  />
                  Choose Widgets Folder Path
                </label>
              </Button>
              <Stack spacing={4} align="stretch">
                {/* {displayMendixPath()} */}
              </Stack>
              <Divider />
              <Heading size="sm">
                <Badge colorScheme="teal" mr="2">
                  Optional
                </Badge>{" "}
                Github Username
              </Heading>
              <Input
                variant="outline"
                placeholder="Github Username"
                value={githubUserName}
                onChange={handleGithubChange}
              />
            </Stack>
          </ModalBody>
          <Divider />

          {mendixAppsPath && windowsIP && (
            <ModalFooter>
              <Button
                colorScheme="teal"
                onClick={acceptAndAddProjects}
                isLoading={isLoading}
              >
                Save
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});
