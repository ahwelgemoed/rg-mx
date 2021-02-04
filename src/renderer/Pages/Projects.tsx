import React, { useState, useContext } from "react";

import {
  Heading,
  Stack,
  ButtonGroup,
  Tag,
  TagLabel,
  Divider,
  Text,
  Box,
} from "@chakra-ui/react";
import ListOfProjects from "../Components/ListOfProjects";
import { AddProjectListModal } from "../Components/AddProjectListModal";
import { ParallelsSettings } from "../Components/ParallelsSettings";
import { RootStoreContext } from "../stores/RootStore";
import { observer } from "mobx-react-lite";

import { FolderNamesType, ProjectType } from "../types/projectTypes";

const Projects: React.FC = observer(() => {
  const projectStore = useContext(RootStoreContext);

  return (
    <div>
      <Stack direction="row" spacing={6} justify="space-between">
        <Box maxW="32rem">
          <Heading mb={4}> Projects</Heading>
          <Text fontSize="xl">
            <Tag size="sm" colorScheme="cyan" borderRadius="full">
              <TagLabel>
                {projectStore.projectsStore.projectsPath
                  ? projectStore.projectsStore.projectsPath
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
      <ListOfProjects />
    </div>
  );
});

export default Projects;
