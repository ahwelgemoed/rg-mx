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
  IconButton,
  createStandaloneToast,
  Box,
  useClipboard,
  Image,
} from "@chakra-ui/react";
import { RepeatIcon, CopyIcon } from "@chakra-ui/icons";
import icon from "../assets/Icon-128.png";
import { getWindowsIp } from "../utils";
import { useSocket } from "../utils/socketHelpers";
import ListOfProjects from "../Components/ListOfProjects";
import { AddProjectListModal } from "../Components/AddProjectListModal";
import ReloadProjectsFolder from "../Components/reloadProjectsFolder";
import { RootStoreContext } from "../stores/RootStore";
import { observer } from "mobx-react-lite";

const spawn = require("cross-spawn");

const toast = createStandaloneToast();

const Projects: React.FC = observer(() => {
  const iPWindows = getWindowsIp();
  const { hasCopied, onCopy } = useClipboard(iPWindows);
  const { sendProjects, openProjectInStudio, resetClients } = useSocket({
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
      openThisProjectInStudio(JSON.parse(openProjectInStudio.body));
    }
  }, [openProjectInStudio]);

  const openThisProjectInStudio = (path: string) => {
    projectStore.projectsStore.openStudioInProject(
      path,
      projectStore.projectsStore.mendixProjectsPathOnWindows
    );
  };
  const openProjectInVSCodeWindowsBase = (projectName: string) => {
    const projectPath = `${projectStore.projectsStore.mendixProjectsPathOnWindows}/${projectName}`;
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
    const projectPath = `${projectStore.projectsStore.mendixProjectsPathOnWindows}/${projectName}/theme/styles`;
    const openMX = spawn("code", [projectPath]);
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
          <Stack direction="row" alignItems="center" mb="4">
            <Image boxSize="80px" src={icon} alt="RG_MX" />
            <Stack direction="column">
              <Heading>RG-MX</Heading>
              <Text fontSize="xl">
                <Tag size="sm" colorScheme="teal" borderRadius="5px">
                  <TagLabel>
                    {projectStore.projectsStore.mendixProjectsPathOnWindows
                      ? projectStore.projectsStore.mendixProjectsPathOnWindows
                      : "No Apps Folder"}
                  </TagLabel>
                </Tag>
              </Text>
            </Stack>
          </Stack>
        </Box>
        <Flex mb={2}></Flex>
        <ButtonGroup size="xs" isAttached>
          <Button
            size="xs"
            onClick={onCopy}
            colorScheme="teal"
            variant="outline"
          >
            {iPWindows} <CopyIcon ml="4" w={4} h={4} color="teal" />
          </Button>
          <ReloadProjectsFolder />
          <IconButton
            colorScheme="yellow"
            size="xs"
            aria-label="reload"
            onClick={() => resetClients()}
            icon={<RepeatIcon />}
          />
          <AddProjectListModal />
        </ButtonGroup>
      </Stack>
      {loading || projectStore.projectsStore.projectLoading ? (
        <>
          <Skeleton height="20px" mb="4" />
          <Skeleton height="20px" mb="4" />
          <Skeleton height="20px" mb="4" />
        </>
      ) : (
        <div>
          <ListOfProjects
            projectsSorted={projectStore.projectsStore.projectsSorted}
            openStudioInProject={openThisProjectInStudio}
            openInVsCode={projectStore.projectsStore.openInVsCode}
            openInVsCodeBase={openProjectInVSCodeWindowsBase}
            openInVsCodeStyles={openProjectInVSCodeWindowsStyles}
            openInWindowsTerminal={(x: any) =>
              projectStore.projectsStore.openProjectInCMD(
                x,
                projectStore.projectsStore.mendixProjectsPathOnWindows
              )
            }
          />
        </div>
      )}
    </Box>
  );
});

export default Projects;
