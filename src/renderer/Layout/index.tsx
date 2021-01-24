import React from 'react'
import { Grid, GridItem } from '@chakra-ui/react'
import Main from './Main'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <>
      <Grid
        h="100vh"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap={4}
      >
        <GridItem rowSpan={2} colSpan={1} p="6" bg="gray.900">
          <Sidebar />
        </GridItem>
        <GridItem rowSpan={2} colSpan={4} p="6">
          <Main />
        </GridItem>
      </Grid>
    </>
  )
}

export default Layout
