import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { useSocket } from '../utils/socketHelpers'
import Projects from '../Pages/Projects'

const Main = () => {
  return (
    <div>
      <Route path="/Projects">
        <Projects />
      </Route>
    </div>
  )
}

export default Main
