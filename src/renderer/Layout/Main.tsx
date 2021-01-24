import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Projects from '../Pages/Projects'

const Main = () => {
  return (
    <div>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/">
          <Projects />
        </Route>
      </Switch>
    </div>
  )
}

export default Main

function About() {
  return <h2>About</h2>
}

function Users() {
  return <h2>Users</h2>
}
