import React, { useState } from 'react'
import {
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  ButtonGroup,
  Tr,
  Th,
  Badge,
  Td,
  Spacer,
  Flex,
  List,
  ListItem,
  Divider
} from '@chakra-ui/react'
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { observer } from 'mobx-react-lite'
import { FolderNamesType, ProjectType } from '../types/projectTypes'
import { format } from 'date-fns'
const platform = require('os').platform()

const ListOfProjects = observer(
  ({
    projectsSorted,
    openStudioInProject,
    openInVsCodeBase,
    openInVsCodeStyles,
    openInMacTerminal,
    openInWindowsTerminal
  }: any) => {
    const [projectsState, setProjectsState] = useState<ProjectType[]>([])
    const [openState, setopenState] = useState<number | undefined>()

    React.useEffect(() => {
      if (projectsSorted && projectsSorted.length) {
        const x = projectsSorted.sort(function (
          a: FolderNamesType,
          b: FolderNamesType
        ) {
          return (
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
          )
        })
        setProjectsState(x)
      }
    }, [projectsSorted])
    return (
      <>
        <List spacing={3}>
          {projectsState.map((item, i) => {
            return (
              <div key={i * 4553}>
                <Flex>
                  <Box>
                    <ListItem>
                      <Badge mr="2" borderRadius="4px">
                        {item.folderNames ? item.folderNames.length : ''}
                      </Badge>
                      {item.name}
                    </ListItem>
                  </Box>
                  <Spacer />
                  <Box mr="4" color="teal.700">
                    {format(new Date(item.lastModified), 'dd/MM/yyyy')}
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
                      {openState === i ? (
                        <>
                          Close <ChevronDownIcon />
                        </>
                      ) : (
                        <>
                          Expand <ChevronRightIcon />
                        </>
                      )}
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
                        <Th>MX Studio</Th>
                        <Th>VSCode</Th>
                        <Th>Terminal</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {item.folderNames ? (
                        item.folderNames.map((fileNames, keyA) => (
                          <Tr key={keyA * 9911}>
                            <Td>{fileNames.name}</Td>
                            <Td>
                              {format(
                                new Date(fileNames.lastModified),
                                'dd/MM/yyyy'
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
                              <ButtonGroup
                                size="sm"
                                isAttached
                                variant="outline"
                              >
                                <Button
                                  colorScheme="teal"
                                  size="xs"
                                  variant="outline"
                                  onClick={() =>
                                    openInVsCodeBase(fileNames.name)
                                  }
                                >
                                  Base
                                </Button>
                                <Button
                                  colorScheme="teal"
                                  size="xs"
                                  variant="outline"
                                  onClick={() =>
                                    openInVsCodeStyles(fileNames.name)
                                  }
                                >
                                  Styles
                                </Button>
                              </ButtonGroup>
                            </Td>
                            <Td>
                              <ButtonGroup
                                size="sm"
                                isAttached
                                variant="outline"
                              >
                                {platform === 'darwin' && (
                                  <Button
                                    colorScheme="teal"
                                    size="xs"
                                    variant="outline"
                                    onClick={() =>
                                      openInMacTerminal(fileNames.name)
                                    }
                                  >
                                    Terminal
                                  </Button>
                                )}
                                <Button
                                  colorScheme="teal"
                                  size="xs"
                                  variant="outline"
                                  onClick={() =>
                                    openInWindowsTerminal(fileNames.name)
                                  }
                                >
                                  CMD
                                </Button>
                              </ButtonGroup>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td>{item.name}</Td>
                          <Td>
                            {format(new Date(item.lastModified), 'dd/MM/yyyy')}
                          </Td>
                          <Td>
                            <Button
                              colorScheme="teal"
                              size="xs"
                              onClick={() => openStudioInProject(item.name)}
                            >
                              Open Studio
                            </Button>
                          </Td>
                          <Td>
                            <ButtonGroup size="sm" isAttached variant="outline">
                              <Button
                                colorScheme="teal"
                                size="xs"
                                variant="outline"
                                onClick={() => openInVsCodeBase(fileNames.name)}
                              >
                                Base
                              </Button>
                              <Button
                                colorScheme="teal"
                                size="xs"
                                variant="outline"
                                onClick={() => openInVsCodeStyles(item.name)}
                              >
                                Styles
                              </Button>
                            </ButtonGroup>
                          </Td>
                          <Td>
                            <ButtonGroup size="sm" isAttached variant="outline">
                              {platform === 'darwin' && (
                                <Button
                                  colorScheme="teal"
                                  size="xs"
                                  variant="outline"
                                  onClick={() => openInMacTerminal(item.name)}
                                >
                                  Terminal
                                </Button>
                              )}
                              <Button
                                colorScheme="teal"
                                size="xs"
                                variant="outline"
                                onClick={() => openInWindowsTerminal(item.name)}
                              >
                                CMD
                              </Button>
                            </ButtonGroup>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                )}
              </div>
            )
          })}
        </List>
      </>
    )
  }
)

export default ListOfProjects
