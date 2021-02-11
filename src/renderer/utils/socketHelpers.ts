import { useEffect, useRef, useState,useContext } from 'react'
// import socketIOClient from "socket.io-client";
import socketIOClient from 'socket.io-client'
import { createStandaloneToast } from '@chakra-ui/react'
import {RootStoreContext} from '../stores/RootStore'
import { socketMessage } from '../../socketMessages'

const toast = createStandaloneToast()

const SOCKET_SERVER_URL = 'http://10.211.55.4:7891'

export const useSocket = () => {
  const projectStore = useContext(RootStoreContext)
  const [openProjectInStudio, setopenProjectInStudio] = useState<string>('')
  const [socketProjects, setSocketProjects] = useState()
  const socketRef = useRef<SocketIOClient.Socket>(
    socketIOClient(SOCKET_SERVER_URL)
  )

  useEffect(() => {
    //   @ts-ignore
    socketRef.current = socketIOClient(SOCKET_SERVER_URL)

    socketRef.current.on('connect', () => {
      console.log(socketRef.current.id)
    })
    socketRef.current.on(socketMessage.ALL_PROJECTS, (message: any) => {
      setSocketProjects(message)
    })
    socketRef.current.on(socketMessage.OPEN_IN_STUDIO, (message: any) => {
      console.log('OPEN_IN_VSCODE', message)
      setopenProjectInStudio(message)
      setTimeout(() => {
        setopenProjectInStudio('')
      }, 2000);
    })
    socketRef.current.on(socketMessage.OPEN_IN_WINDOWS_CMD, (message: any) => {
      const prjToOpen = JSON.parse(message.body)
      console.log('prjToOpen', prjToOpen)
      projectStore.projectsStore.openProjectInCMD(prjToOpen, projectStore.projectsStore.mendixProjectsPathMac)

    })

    return () => {
      //   @ts-ignore
      socketRef.current.disconnect()
    }
  }, [])
  useEffect(() => {
    if (socketRef.current) {
      // @ts-ignore
      if (socketRef.current.connected) {
        toast({
          title: 'Windows Connected',
          status: 'success',
          duration: 7000,
          position: 'top',
          isClosable: true
        })
      }
    }
  }, [socketRef])

  const sendProjects = (messageBody: any) => {
    socketRef.current.compress(false).emit(socketMessage.ALL_PROJECTS, {
      messageBody: stringMyBody(messageBody)
    })
  }
  const sendOpenStudioInProject = (messageBody: any) => {
    socketRef.current.emit(socketMessage.OPEN_IN_STUDIO, {
      body: stringMyBody(messageBody),
      senderId: socketRef.current.id
    })
  }
  const sendOpenInVsCode = (messageBody: any) => {
    socketRef.current.emit(socketMessage.OPEN_IN_VSCODE, {
      body: stringMyBody(messageBody),
      senderId: socketRef.current.id
    })
  }

  const isSocketConnected =
    socketRef && socketRef.current && socketRef.current.connected

  return {
    isSocketConnected,
    sendOpenInVsCode,
    sendProjects,
    sendOpenStudioInProject,
    socketProjects,
    openProjectInStudio
  }
}
const stringMyBody = (body: any) => {
  return JSON.stringify(body)
}
