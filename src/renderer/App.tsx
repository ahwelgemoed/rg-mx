import React from "react";
import "./App.css";
import { hot } from "react-hot-loader/root";
// import { remote } from 'electron'
import { HashRouter as Router } from "react-router-dom";
import Layout from "./Layout";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";

const App: React.FC = () => {
  // const electron = process.versions.electron
  // const node = process.versions.node
  // const platform = require('os').platform()
  // const version = require('../../package.json').version

  // const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  //   e.preventDefault()
  //   remote.shell.openExternal(e.currentTarget.href)
  // }

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <Layout />
      </Router>
    </ChakraProvider>
  );
};

export default hot(App);
