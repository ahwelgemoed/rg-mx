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
  List,
  ListItem,
  Divider,
} from "@chakra-ui/react";

import { observer } from "mobx-react-lite";
import { FolderNamesType, ProjectType } from "../types/projectTypes";
import { format } from "date-fns";

const ListOfProjects = observer(
  ({ projectsSorted, openStudioInProject, openInVsCode }: any) => {
    const [projectsState, setProjectsState] = useState<ProjectType[]>([]);
    const [openState, setopenState] = useState<number | undefined>();

    React.useEffect(() => {
      if (projectsSorted && projectsSorted.length) {
        const x = projectsSorted.sort(function (
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
    }, [projectsSorted]);
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
                                openStudioInProject(fileNames.name)
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
                              onClick={() => openInVsCode(fileNames.name)}
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
                                openStudioInProject(fileNames.name)
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
  }
);

export default ListOfProjects;
