import React, { useEffect, useContext, useState } from "react";
import {
  Heading,
  Stack,
  ButtonGroup,
  Tag,
  TagLabel,
  Skeleton,
  Divider,
  Text,
  Box,
} from "@chakra-ui/react";
import { getWindowsIp } from "../utils";
import { useSocket } from "../utils/socketHelpers";
import ListOfProjects from "../Components/ListOfProjects";
import { AddProjectListModal } from "../Components/AddProjectListModal";
import { ParallelsSettings } from "../Components/ParallelsSettings";
import { RootStoreContext } from "../stores/RootStore";
import { observer } from "mobx-react-lite";

import { FolderNamesType, ProjectType } from "../types/projectTypes";

const Projects: React.FC = observer(() => {
  const iPWindows = getWindowsIp().address;
  const {
    sendProjects,
    sendOpenStudioInProject,
    openProjectInStudio,
  } = useSocket({
    windowsIp: iPWindows,
  });
  const [loading, setLoading] = useState(true);
  const projectStore = useContext(RootStoreContext);
  useEffect(() => {
    const interval = setInterval(() => {
      if (projectStore.projectsStore.projectsSorted) {
        sendProjects(projectStore.projectsStore.projectsSorted);
        loading && setLoading(false);
      }
    }, 5000);
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
  useEffect(() => {
    console.log(
      "projectStore.projectsStore.projectsSorted",
      projectStore.projectsStore.projectsSorted
    );
  }, [projectStore.projectsStore.projectsSorted]);
  return (
    <div>
      <Stack direction="row" spacing={6} justify="space-between">
        <Box maxW="32rem">
          <Heading mb={4}> Projects</Heading>
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
        <ButtonGroup size="sm" isAttached variant="outline">
          <ParallelsSettings />
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
        />
      )}
    </div>
  );
});

export default Projects;
