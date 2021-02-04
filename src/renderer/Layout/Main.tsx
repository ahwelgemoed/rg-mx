import React from "react";
import { Switch, Route } from "react-router-dom";
import { useSocket } from "../utils/socketHelpers";
import Projects from "../Pages/Projects";

const Main = () => {
  console.log("useSocket()", useSocket());
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
