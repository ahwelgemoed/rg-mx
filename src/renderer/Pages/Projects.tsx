import React, { useEffect, useContext, useState } from "react";
import {
  Heading,
  Stack,
  ButtonGroup,
  Tag,
  TagLabel,
  Skeleton,
  Button,
  Flex,
  Text,
  createStandaloneToast,
  Box,
  useClipboard,
} from "@chakra-ui/react";
const spawn = require("cross-spawn");
import { getWindowsIp } from "../utils";
import { useSocket } from "../utils/socketHelpers";
import ListOfProjects from "../Components/ListOfProjects";
import { AddProjectListModal } from "../Components/AddProjectListModal";
import ReloadProjectsFolder from "../Components/reloadProjectsFolder";
import { RootStoreContext } from "../stores/RootStore";
import { observer } from "mobx-react-lite";
import { CopyIcon } from "@chakra-ui/icons";
const toast = createStandaloneToast();
const Projects: React.FC = observer(() => {
  const iPWindows = getWindowsIp().address;
  const { hasCopied, onCopy } = useClipboard(iPWindows);
  const {
    sendProjects,
    sendOpenStudioInProject,
    openProjectInStudio,
  } = useSocket({
    windowsIp: iPWindows,
  });
  const [loading, setLoading] = useState(true);
  const projectStore = useContext(RootStoreContext);
  const sendProjectsToServer = () => {
    if (projectStore.projectsStore.projectsSorted) {
      sendProjects(projectStore.projectsStore.projectsSorted);
      loading && setLoading(false);
    }
  };
  useEffect(() => {
    sendProjectsToServer();
    const interval = setInterval(() => {
      sendProjectsToServer();
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (openProjectInStudio) {
      // @ts-ignore
      opneThisProjectInStudio(JSON.parse(openProjectInStudio.body));
    }
  }, [openProjectInStudio]);

  const opneThisProjectInStudio = (path: string) => {
    projectStore.projectsStore.openStudioInProject(
      path,
      projectStore.projectsStore.mendixProjectsPathMac
    );
  };
  const openProjectInVSCodeWindowsBase = (projectName: string) => {
    const projectPath = `${projectStore.projectsStore.mendixProjectsPathMac}/${projectName}`;
    const openMX = spawn("code", [projectPath], { stdio: "inherit" });
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
  };
  const openProjectInVSCodeWindowsStyles = (projectName: string) => {
    const projectPath = `${projectStore.projectsStore.mendixProjectsPathMac}/${projectName}/theme/styles`;
    const openMX = spawn("code", [projectPath]);
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
        <Box maxW="32rem">
          <Heading mb={4}>Projects</Heading>
          <Text fontSize="xl">
            <Tag size="sm" colorScheme="cyan" borderRadius="full">
              <TagLabel>
                {projectStore.projectsStore.mendixProjectsPathMac
                  ? projectStore.projectsStore.mendixProjectsPathMac
                  : "No Apps Folder"}
              </TagLabel>
            </Tag>
          </Text>
        </Box>
        <Flex mb={2}></Flex>
        <ButtonGroup size="sm" isAttached>
          <Button
            size="sm"
            onClick={onCopy}
            colorScheme="teal"
            variant="outline"
          >
            {iPWindows} <CopyIcon ml="4" w={4} h={4} color="teal" />
          </Button>
          <ReloadProjectsFolder />
          <AddProjectListModal />
        </ButtonGroup>
      </Stack>
      {loading ? (
        <>
          <Skeleton height="20px" mb="4" />
          <Skeleton height="20px" mb="4" />
          <Skeleton height="20px" mb="4" />
        </>
      ) : (
        <ListOfProjects
          projectsSorted={projectStore.projectsStore.projectsSorted}
          openStudioInProject={opneThisProjectInStudio}
          openInVsCode={projectStore.projectsStore.openInVsCode}
          openInVsCodeBase={openProjectInVSCodeWindowsBase}
          openInVsCodeStyles={openProjectInVSCodeWindowsStyles}
          openInWindowsTerminal={projectStore.projectsStore.openProjectInCMD}
        />
      )}
    </Box>
  );
});

export default Projects;
