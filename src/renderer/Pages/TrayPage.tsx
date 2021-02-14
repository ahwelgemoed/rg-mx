import React, { useContext } from "react";
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
  createStandaloneToast,
} from "@chakra-ui/react";
const fixPath = require("fix-path");
import { CloseIcon, RepeatIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSocket } from "../utils/socketHelpers";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../stores/RootStore";
import ListOfProjects from "../Components/ListOfProjects";
import { TrayAppSettings } from "../Components/TrayAppSettings";
import Simulator from "../Components/Simulator";
import Widgets from "../Components/Widgets";
import GistBoard from "../Components/GistBoard";
import icon from "../assets/Icon-128.png";
import { useHistory } from "react-router-dom";
const { ipcRenderer } = require("electron");
const platform = require("os").platform();
const { getCurrentWindow } = require("electron").remote;
// const spawn = require("cross-spawn");
const spawn = require("child_process").spawn;

const toast = createStandaloneToast();
const TrayPage = observer(() => {
  platform === "darwin" && fixPath(); // Super important for MAC Path Fixes
  const history = useHistory();
  const mainStore = React.useContext(RootStoreContext);
  const {
    isSocketConnected,
    socketProjects,
    sendOpenStudioInProject,
    sendOpenInCMD,
  } = useSocket({
    windowsIp: mainStore.macStore.windowsIp,
  });
  const openInMacTerminal = (projectName: string) => {
    const projectPath = `${mainStore.macStore.macProjectsPath}/${projectName}`;
    const openMX = spawn("open", ["-a", "Terminal", projectPath]);
    openMX.stderr.on("data", (data: any) => {
      toast({
        status: "error",
        title: "Error",
        description: `${data}`,
        duration: 7000,
        position: "top",
        isClosable: true,
      });
    });
    openMX.on("close", (code: any) => {
      if (!code) {
        toast({
          title: `Opening ${projectName} - Terminal`,
          status: "success",
          duration: 7000,
          position: "top",
          isClosable: true,
        });
      }
    });
  };
  const openProjectInVSCodeMacBase = (projectName: string) => {
    const projectPath = `${mainStore.macStore.macProjectsPath}/${projectName}`;
    const openMX = spawn("code", [projectPath], { stdio: "inherit" });
    openMX.stderr.on("data", (data: any) => {
      console.log("data", data);
      toast({
        status: "error",
        title: "Error",
        description: `${data}`,
        duration: 7000,
        position: "top",
        isClosable: true,
      });
    });
    openMX.on("close", (code: any) => {
      if (!code) {
        toast({
          title: `Opening ${projectName} - Base`,
          status: "success",
          duration: 7000,
          position: "top",
          isClosable: true,
        });
      }
    });
  };
  const openProjectInVSCodeMacStyles = (projectName: string) => {
    const projectPath = `${mainStore.macStore.macProjectsPath}/${projectName}/theme/styles`;
    const openMX = spawn("code", [projectPath]);
    // const ls = spawn('ls', ['-lh', '/usr']);
    openMX.stderr.on("data", (data: any) => {
      console.log("data", data);
      toast({
        status: "error",
        title: "Error",
        description: `${data}`,
        duration: 7000,
        position: "top",
        isClosable: true,
      });
    });
    openMX.on("close", (code: any) => {
      if (!code) {
        toast({
          title: `Opening ${projectName} - Styles`,
          status: "success",
          duration: 7000,
          position: "top",
          isClosable: true,
        });
      }
    });
  };
  console.log(
    'process.env.NODE_ENV !== "development"',
    process.env.NODE_ENV !== "development"
  );
  return (
    <Box p="4">
      <Stack direction="row" spacing={6} justify="space-between">
        <Stack direction="row" alignItems="center">
          <Image boxSize="80px" src={icon} alt="Segun Adebayo" />
          <Stack direction="column" mb="4">
            <Heading>Mendid-X </Heading>
            <Badge
              colorScheme={isSocketConnected ? "teal" : "red"}
              borderRadius="5px"
            >
              {isSocketConnected
                ? "Windows Is Connected"
                : "Windows Is Offline"}
            </Badge>
          </Stack>
        </Stack>
        <ButtonGroup size="sm" isAttached>
          <TrayAppSettings />
          {process.env.NODE_ENV === "development" && (
            <IconButton
              colorScheme="yellow"
              size="xs"
              aria-label="reload"
              onClick={() => history.push("/Projects")}
              icon={<ViewOffIcon />}
            />
          )}
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
            onClick={() =>
              ipcRenderer.send(
                "asynchronous-message",
                "example example send to main process"
              )
            }
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
  );
});

export default TrayPage;

// TypeError: Error processing argument at index 0, conversion failure from /Applications/Mendid-X.app/Contents/Resources/app.asar/dist/electron/trayIcon.png
// at u (/Applications/Mendid-X.app/Contents/Resources/app.asar/dist/electron/main.js:8:28791)
// at App.<anonymous> (/Applications/Mendid-X.app/Contents/Resources/app.asar/dist/electron/main.js:8:30230)
// at App.emit (events.js:208:15)
