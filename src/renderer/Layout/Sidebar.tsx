import React from "react";
import { Link } from "react-router-dom";
import { Flex, Spacer, Box, Text } from "@chakra-ui/react";
import { RepeatClockIcon, SearchIcon } from "@chakra-ui/icons";
import { RootStoreContext } from "../stores/RootStore";
import { Button, Divider } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { IconButton } from "@chakra-ui/react";
const Sidebar = observer(() => {
  const projectStore = React.useContext(RootStoreContext);

  console.log("prje", projectStore.projectsStore.projectLoading);
  return (
    // <div>
    <Flex justify="space-between" direction="column" h="100%">
      <Box>
        <nav>
          <Link style={{ textAlign: "left" }} to="/">
            <Text fontSize="lg" color="cyan" pb="4">
              <IconButton
                mr="8"
                aria-label="Search database"
                icon={<SearchIcon />}
              />
              Mendix Projects
            </Text>
          </Link>

          <Divider />
        </nav>
      </Box>
      <Spacer />
      <Box>
        <Button
          mr="-px"
          w="100%"
          colorScheme={
            projectStore.projectsStore.projectLoading ? "pink" : "cyan"
          }
          isLoading={projectStore.projectsStore.projectLoading}
          onClick={() => projectStore.projectsStore.setSortedProjects()}
        >
          <RepeatClockIcon size="xs" />
          {"  "}
          Sync Projects
        </Button>
      </Box>
    </Flex>
    // </div>
  );
});

export default Sidebar;
