import React, { useState, useContext } from "react";
import { ExtraInfoModal } from "../Components/ExtraInfoModal";
import {
  Heading,
  Stack,
  ButtonGroup,
  Button,
  Tag,
  TagLabel,
  Divider,
  Text,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { AddProjectListModal } from "../Components/AddProjectListModal";
import { ParallelsSettings } from "../Components/ParallelsSettings";
import { RootStoreContext } from "../stores/RootStore";
import { observer } from "mobx-react-lite";

import { format } from "date-fns";

import { FolderNamesType, ProjectType } from "../types/projectTypes";

// const socketUrl = "ws://localhost:7891";
// const socketUrl = "http://127.0.0.1:7891/";
const Projects: React.FC = observer(() => {
  const projectStore = useContext(RootStoreContext);
  const [openState, setopenState] = useState<number | undefined>();
  const [projectsState, setProjectsState] = useState<ProjectType[]>([]);
  React.useEffect(() => {
    if (
      projectStore.projectsStore.projectsSorted &&
      projectStore.projectsStore.projectsSorted.length
    ) {
      const x = projectStore.projectsStore.projectsSorted.sort(function (
        a: FolderNamesType,
        b: FolderNamesType
      ) {
        return (
          new Date(b.lastModified).getTime() -
          new Date(a.lastModified).getTime()
        );
      });
      setProjectsState(x);
    }
  }, [projectStore.projectsStore.projectsSorted]);
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

      <Divider pt="2" mb="4" orientation="horizontal" />
      <Heading mb={4}>Parsed Projects</Heading>
      {projectsState.length ? (
        <Box>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Project Name</Th>
                <Th>Pulled Branches</Th>
                <Th>Date Modified</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {projectsState.map((item, i) => {
                return (
                  <>
                    <Tr>
                      <Td>{item.name}</Td>
                      <Td>{item.folderNames.length}</Td>
                      <Td>
                        {format(new Date(item.lastModified), "dd/MM/yyyy")}
                      </Td>
                      <Td>
                        <Button
                          colorScheme="teal"
                          size="xs"
                          variant="ghost"
                          onClick={() =>
                            openState === i
                              ? setopenState(undefined)
                              : setopenState(i)
                          }
                        >
                          {openState === i ? "Close" : "Open"}
                        </Button>
                      </Td>
                    </Tr>
                    {openState === i && (
                      <Tr bg="teal">
                        <Table size="sm" mt="10" mb="10">
                          <Thead>
                            <Tr>
                              <Th>Branches</Th>
                              <Th>Date Modified</Th>
                              <Th></Th>
                              <Th></Th>
                              <Th></Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {item.folderNames.map((fileNames) => (
                              <Tr>
                                <Td>{fileNames.name}</Td>
                                <Td>
                                  {format(
                                    new Date(fileNames.lastModified),
                                    "dd/MM/yyyy"
                                  )}
                                </Td>
                                <Td>
                                  <Button
                                    colorScheme="teal"
                                    size="xs"
                                    onClick={() =>
                                      projectStore.projectsStore.openStudioInProject(
                                        fileNames.name
                                      )
                                    }
                                  >
                                    Open Studio
                                  </Button>
                                </Td>
                                <Td>
                                  <Button
                                    colorScheme="teal"
                                    size="xs"
                                    variant="outline"
                                    onClick={() =>
                                      projectStore.projectsStore.openInVsCode(
                                        fileNames.name
                                      )
                                    }
                                  >
                                    Open Styles
                                  </Button>
                                  {/* <ExtraInfoModal project={fileNames} /> */}
                                </Td>
                                <Td>
                                  <Button
                                    colorScheme="teal"
                                    size="xs"
                                    variant="outline"
                                    onClick={() =>
                                      projectStore.projectsStore.openStudioInProject(
                                        fileNames.name
                                      )
                                    }
                                  >
                                    CMD
                                  </Button>
                                  {/* <ExtraInfoModal project={fileNames} /> */}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Tr>
                    )}
                  </>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Heading size="xs" mb={4}>
          No Projects Added
        </Heading>
      )}
    </div>
  );
});

export default Projects;
