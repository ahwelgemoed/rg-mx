import React from "react";
import { Button } from "@chakra-ui/react";
import { RepeatClockIcon, SearchIcon } from "@chakra-ui/icons";
import { RootStoreContext } from "../stores/RootStore";

import { observer } from "mobx-react-lite";
const reloadProjectsFolder = observer(() => {
  const mainStore = React.useContext(RootStoreContext);
  const loadProjects = () => {
    if (mainStore.projectsStore.projectsSorted) {
      mainStore.projectsStore.setSortedProjects(
        mainStore.projectsStore.sortOption
      );
    }
  };
  React.useEffect(() => {
    loadProjects();
    const interval = setInterval(() => {
      loadProjects();
    }, 900000); // 15mins
    return () => clearInterval(interval);
  }, []);
  return (
    <Button
      size="xs"
      variant="outline"
      colorScheme={mainStore.projectsStore.projectLoading ? "pink" : "teal"}
      isLoading={mainStore.projectsStore.projectLoading}
      onClick={() => loadProjects()}
    >
      <RepeatClockIcon size="xs" mr="2" />
      Sync
    </Button>
  );
});

export default reloadProjectsFolder;
