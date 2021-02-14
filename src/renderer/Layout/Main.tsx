import React from "react";
import { Switch, Route } from "react-router-dom";
import Projects from "../Pages/Projects";

const Main = () => {
  return (
    <div>
      <Route path="/Projects">
        <Projects />
      </Route>
    </div>
  );
};

export default Main;
