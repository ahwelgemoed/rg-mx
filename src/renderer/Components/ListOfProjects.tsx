import React, { useContext, useState } from "react";
import {
  Heading,
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Badge,
  Td,
  Spacer,
  Flex,
} from "@chakra-ui/react";
import {
  List,
  ListItem,
  Divider,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";

import { SimpleGrid } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../stores/RootStore";
import { FolderNamesType, ProjectType } from "../types/projectTypes";
import { useSocket } from "../utils/socketHelpers";
import { format } from "date-fns";

const ListOfProjects = observer(() => {
  const [projectsState, setProjectsState] = useState<ProjectType[]>([]);
  const [openState, setopenState] = useState<number | undefined>();
  const { sendAllProjects } = useSocket();
  const projectStore = useContext(RootStoreContext);

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
      sendAllProjects(x);
    }
  }, [projectStore.projectsStore.projectsSorted]);
  return (
    <>
      <List spacing={3}>
        {projectsState.map((item, i) => {
          return (
            <>
              <Flex>
                <Box>
                  <ListItem>
                    <Badge mr="2">{item.folderNames.length}</Badge>
                    {item.name}
                  </ListItem>
                </Box>
                <Spacer />
                <Box mr="4" color="teal.700">
                  {format(new Date(item.lastModified), "dd/MM/yyyy")}
                </Box>
                <Box>
                  <Button
                    colorScheme="teal"
                    size="xs"
                    onClick={() =>
                      openState === i
                        ? setopenState(undefined)
                        : setopenState(i)
                    }
                  >
                    {openState === i ? "Close" : "Open"}
                  </Button>
                </Box>
              </Flex>
              <Divider />
              {openState === i && (
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
              )}
            </>
          );
        })}
      </List>
    </>
  );
});

export default ListOfProjects;
