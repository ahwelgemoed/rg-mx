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
} from "@chakra-ui/react";
import { useSocket } from "../utils/socketHelpers";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../stores/RootStore";
import ListOfProjects from "../Components/ListOfProjects";
import { TrayAppSettings } from "../Components/TrayAppSettings";
const TrayPage = observer(() => {
  const mainStore = React.useContext(RootStoreContext);
  const {
    isSocketConnected,
    socketProjects,
    sendOpenStudioInProject,
  } = useSocket({
    windowsIp: mainStore.macStore.windowsIp,
  });
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
                openInVsCode={mainStore.projectsStore.openInVsCode}
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
