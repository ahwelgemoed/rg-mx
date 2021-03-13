import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { Skeleton, Stack } from "@chakra-ui/react";
import { platform } from "os";
import Main from "./Main";
import TrayPage from "../Pages/TrayPage";
const Layout = () => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  useEffect(() => {
    if (platform() === "darwin") {
      history.push("/tray");
      setLoading(false);
    } else {
      history.push("/Projects");
      setLoading(false);
    }
  }, []);
  if (loading) {
    return (
      <>
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      </>
    );
  }
  return (
    <>
      <Switch>
        <Route path="/tray">
          <TrayPage />
        </Route>
        <Main />
      </Switch>
    </>
  );
};

export default Layout;
