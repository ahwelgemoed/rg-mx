import React from "react";
import { Route } from "react-router-dom";
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
