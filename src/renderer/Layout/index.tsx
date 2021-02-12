import React, { useEffect, useState } from 'react'
import { Grid, GridItem } from '@chakra-ui/react'
import Main from './Main'
import Sidebar from './Sidebar'
import { Switch, Route, useHistory } from 'react-router-dom'
import TrayPage from '../Pages/TrayPage'

const platform = require('os').platform()

const Layout = () => {
  const [loading, setLoading] = useState(true)
  const history = useHistory()

  useEffect(() => {
    if (platform === 'darwin') {
      history.push('/tray')
      setLoading(false)
    } else {
      history.push('/Projects')
      setLoading(false)
    }
  }, [])
  if (loading) {
    return <>Loading</>
  }
  return (
    <>
      <Switch>
        <Route path="/tray">
          <TrayPage />
        </Route>
        <Route path="/">
          <Grid
            h="100vh"
            templateRows="repeat(1, 1fr)"
            templateColumns="repeat(12, 1fr)"
            gap={4}
          >
            <GridItem rowSpan={1} colSpan={1} p="6" bg="gray.900">
              <Sidebar />
            </GridItem>
            <GridItem rowSpan={1} colSpan={11} p="6">
              <Main />
            </GridItem>
          </Grid>
        </Route>
      </Switch>
    </>
  )
}

export default Layout
