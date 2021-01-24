import React, { useState, useContext } from "react";
import {
  Heading,
  Stack,
  ButtonGroup,
  Button,
  Tag,
  TagLabel,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { AddProjectListModal } from "./AddProjectListModal";
import { RootStoreContext } from "../stores/RootStore";
import { observer } from "mobx-react-lite";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
const Projects: React.FC = observer(() => {
  const projectStore = useContext(RootStoreContext);
  console.log(
    "projectStore.projectsStore.projectsSorted",
    projectStore.projectsStore.projectsSorted
  );

  const [openState, setopenState] = useState([]);

  const PROJECTS_FOLDER_PATH = "ls";

  return (
    <div>
      <Stack direction="row" spacing={6} justify="space-between">
        <Heading as="h2" size="xl">
          Projects
        </Heading>
        <ButtonGroup size="sm" isAttached variant="outline">
          <AddProjectListModal />
        </ButtonGroup>
      </Stack>
      <Tag size="sm" colorScheme="cyan" borderRadius="full">
        <TagLabel>
          {projectStore.projectsStore.projectsPath
            ? projectStore.projectsStore.projectsPath
            : "No Apps Folder"}
        </TagLabel>
      </Tag>
      <Divider pt="2" mb="4" orientation="horizontal" />
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Project Name</Th>
            <Th>No: Pulled Branches</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {projectStore.projectsStore.projectsSorted &&
            projectStore.projectsStore.projectsSorted.map((item, i) => {
              console.log("item", item);
              return (
                <>
                  <Tr>
                    <Td>{item.name}</Td>
                    <Td>{item.foldedNames.length}</Td>
                    <Td>
                      <Button
                        colorScheme="teal"
                        size="xs"
                        variant="ghost"
                        onClick={() =>
                          openState === i ? setopenState(null) : setopenState(i)
                        }
                      >
                        {openState === i ? "Close" : "Open"}
                      </Button>
                    </Td>
                  </Tr>
                  {openState === i && (
                    <Tr>
                      <Table size="sm" mt="10" mb="10">
                        <Thead>
                          <Tr>
                            <Th>Branches</Th>
                            <Th>Open</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {item.foldedNames.map((fileNames) => (
                            <Tr>
                              <Td>{fileNames}</Td>
                              <Td>
                                <Button
                                  colorScheme="teal"
                                  size="xs"
                                  onClick={() =>
                                    projectStore.projectsStore.openStudioInProject(
                                      fileNames
                                    )
                                  }
                                >
                                  Open Studio
                                </Button>
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
    </div>
  );
});

export default Projects;
