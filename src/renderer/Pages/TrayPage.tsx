import React, { useContext } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  Box,
  Badge,
  TabPanel,
  Heading,
} from "@chakra-ui/react";
import { useSocket } from "../utils/socketHelpers";
import { RootStoreContext } from "../stores/RootStore";
import ListOfProjects from "../Components/ListOfProjects";

const TrayPage = () => {
  const { isSocketConnected, socketProjects } = useSocket();
  console.log("socketProjects", socketProjects && socketProjects.messageBody);
  const projectStore = useContext(RootStoreContext);
  return (
    <Box p="4">
      <Heading mb={4}>
        Mendid-X{" "}
        <Badge colorScheme={isSocketConnected ? "teal" : "red"}>
          {isSocketConnected ? "Connected" : "Windows Offline"}
        </Badge>
      </Heading>
      <Tabs>
        <TabList>
          <Tab isDisabled={!isSocketConnected}>Projects</Tab>
          <Tab>Simulator</Tab>
          <Tab>ClipBoard</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>2!</p>
            <ListOfProjects
              projectsSorted={
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
  );
};

export default TrayPage;
