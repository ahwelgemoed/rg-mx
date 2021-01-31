import React from "react";
import { Switch, Route } from "react-router-dom";

import Projects from "../Pages/Projects";

const Main = () => {
  return (
    <div>
      <Route path="/Projects">
        <Projects />
      </Route>
      <Route path="/About">
        <About />
      </Route>
    </div>
  );
};

export default Main;

function About() {
  return <h2>About me</h2>;
}
