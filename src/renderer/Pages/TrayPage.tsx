import React, { useContext } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Skeleton,
  Tab,
  Stack,
  ButtonGroup,
  Box,
  Badge,
  TabPanel,
  Heading,
  createStandaloneToast,
} from "@chakra-ui/react";
import { useSocket } from "../utils/socketHelpers";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../stores/RootStore";
import ListOfProjects from "../Components/ListOfProjects";
import { TrayAppSettings } from "../Components/TrayAppSettings";
const spawn = require("cross-spawn");

const toast = createStandaloneToast();
const TrayPage = observer(() => {
  const mainStore = React.useContext(RootStoreContext);
  console.log("mainStore.macStore.windowsIp", mainStore.macStore.windowsIp);
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
          title: `Openasding ${projectName} - Terminal`,
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
  return (
    <Box p="4">
      <Stack direction="row" spacing={6} justify="space-between">
        <Heading mb={4}>
          Mendid-X{" "}
          <Badge colorScheme={isSocketConnected ? "teal" : "red"}>
            {isSocketConnected ? "Connected" : "Windows Offline"}
          </Badge>
        </Heading>
        <ButtonGroup size="sm" isAttached variant="outline">
          <TrayAppSettings />
        </ButtonGroup>
      </Stack>
      <Tabs>
        <TabList>
          <Tab isDisabled={!isSocketConnected}>Projects</Tab>
          <Tab>Simulator</Tab>
          <Tab>ClipBoard</Tab>
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
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
});

export default TrayPage;
