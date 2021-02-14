import React, { useEffect, useState } from "react";
import {
  Heading,
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Stack,
  Text,
  ButtonGroup,
  Tr,
  Th,
  Badge,
  Td,
  Spacer,
  Flex,
  List,
  ListItem,
  Divider,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { format } from "date-fns";
const { shell } = require("electron");
type GistBoardProps = {
  ghUserName: string;
};
const GistBoard = ({ ghUserName }: GistBoardProps) => {
  const [listOfgists, setListOfgists] = useState<any[] | null>(null);
  const [openState, setopenState] = useState<number | undefined>();
  useEffect(() => {
    console.log("ghUserName", ghUserName);
    if (ghUserName) {
      fetch(`https://api.github.com/users/${ghUserName}/gists`)
        .then((response) => response.json())
        .then((data) => setListOfgists(data));
    }
  }, [ghUserName]);
  return (
    <div>
      <List spacing={3}>
        {!ghUserName ? (
          <Heading>No Github Username</Heading>
        ) : (
          <Heading>All Public Gists for {ghUserName}</Heading>
        )}
        <Heading as="h6" size="xs" mb={4}>
          This is a list of all the public gist for the user you have entered
        </Heading>

        {listOfgists &&
          listOfgists.map((gist, i) => {
            const files = Object.entries(gist.files);
            return (
              <div key={i * 898}>
                <Stack direction="row" spacing={6} justify="space-between">
                  <Box mr="2">
                    <ListItem>{gist.description}</ListItem>
                  </Box>
                  <Stack direction="row">
                    <Text mr="4" color="teal.700">
                      {format(new Date(gist.updated_at), "dd/MM/yyyy")}
                    </Text>
                    <ButtonGroup size="sm" isAttached>
                      <Button
                        colorScheme="teal"
                        size="xs"
                        onClick={() => shell.openExternal(gist.html_url)}
                      >
                        View in Browser
                      </Button>
                      <Button
                        variant="outline"
                        colorScheme="teal"
                        size="xs"
                        onClick={() =>
                          openState === i
                            ? setopenState(undefined)
                            : setopenState(i)
                        }
                      >
                        {openState === i ? "Close Files" : "Expand Files"}
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </Stack>
                {openState === i && (
                  <Table size="sm" mt="10" mb="10">
                    <Thead>
                      <Tr>
                        <Th>File Name</Th>
                        <Th>Language</Th>
                        <Th>View Raw</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {files.map((file: any) => {
                        return (
                          <Tr>
                            <Td>{file[0]}</Td>
                            <Td>{file[1] && file[1].language}</Td>
                            <Td>
                              {" "}
                              <Button
                                colorScheme="teal"
                                size="xs"
                                onClick={() =>
                                  shell.openExternal(file[1].raw_url)
                                }
                              >
                                View in Browser
                              </Button>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                )}
                <Divider />
              </div>
            );
          })}
      </List>
    </div>
  );
};

export default GistBoard;
