import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import ListOfProjects from "../Components/ListOfProjects";

const TrayPage = () => {
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Projects</Tab>
          <Tab>Simulator</Tab>
          <Tab>ClipBoard</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>one!</p>
            <ListOfProjects />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default TrayPage;
