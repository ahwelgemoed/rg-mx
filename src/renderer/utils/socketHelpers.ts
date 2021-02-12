import { useEffect, useRef, useState, useContext } from 'react'
// import socketIOClient from "socket.io-client";
import socketIOClient from 'socket.io-client'
import { createStandaloneToast } from '@chakra-ui/react'
import { RootStoreContext } from '../stores/RootStore'
import { socketMessage } from '../../socketMessages'

const toast = createStandaloneToast()

type UseSocketTypes = {
  windowsIp: string;
};
export const useSocket = (props: UseSocketTypes) => {
  // const SOCKET_SERVER_URL = props && `http://10.211.55.4:7891`;
  const SOCKET_SERVER_URL = props && `http://${props.windowsIp}:7891`
  const [socketProjects, setSocketProjects] = useState()
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false)

  const projectStore = useContext(RootStoreContext)
  const [openProjectInStudio, setopenProjectInStudio] = useState<string>('')
  const socketRef = useRef<SocketIOClient.Socket>(
    socketIOClient(SOCKET_SERVER_URL)
  )
  const tryReconnect = () => {
    setTimeout(() => {
      socketRef.current.io.open((err) => {
        if (err) {
          tryReconnect()
        }
      })
    }, 2000)
  }
  useEffect(() => {
    //   @ts-ignore
    socketRef.current = socketIOClient(SOCKET_SERVER_URL)

    socketRef.current.on('connect', () => {})
    socketRef.current.on('close', (Arno: any) => console.log('Arno', Arno))

    socketRef.current.on('disconnect', () => {
      setIsSocketConnected(false)
      tryReconnect()
      console.log('Disconnected')
    })
    socketRef.current.on(socketMessage.ALL_PROJECTS, (message: any) => {
      setSocketProjects(message)
    })
    socketRef.current.on(socketMessage.OPEN_IN_STUDIO, (message: any) => {
      setopenProjectInStudio(message)
      setTimeout(() => {
        setopenProjectInStudio('')
      }, 2000)
    })
    socketRef.current.on(socketMessage.OPEN_IN_WINDOWS_CMD, (message: any) => {
      const prjToOpen = JSON.parse(message.body)
      projectStore.projectsStore.openProjectInCMD(
        prjToOpen,
        projectStore.projectsStore.mendixProjectsPathMac
      )
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
        setIsSocketConnected(true)
        toast({
          title: 'Windows Connected',
          status: 'success',
          duration: 7000,
          position: 'top',
          isClosable: true
        })
      }
      if (socketRef.current.disconnected && isSocketConnected) {
        setIsSocketConnected(false)
        toast({
          title: 'Windows Disconnected',
          status: 'error',
          duration: 7000,
          position: 'top',
          isClosable: true
        })
      }
    }
  }, [socketRef.current.connected, socketRef.current.disconnected])

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
    toast({
      title: `Opening ${messageBody}`,
      status: 'success',
      duration: 7000,
      position: 'top',
      isClosable: true
    })
  }
  const sendOpenInCMD = (messageBody: any) => {
    socketRef.current.emit(socketMessage.OPEN_IN_WINDOWS_CMD, {
      body: stringMyBody(messageBody),
      senderId: socketRef.current.id
    })
    toast({
      title: `Opening ${messageBody}`,
      status: 'success',
      duration: 7000,
      position: 'top',
      isClosable: true
    })
  }
  const sendOpenInVsCode = (messageBody: any) => {
    socketRef.current.emit(socketMessage.OPEN_IN_VSCODE, {
      body: stringMyBody(messageBody),
      senderId: socketRef.current.id
    })
  }
  return {
    isSocketConnected,
    sendOpenInVsCode,
    sendOpenInCMD,
    sendProjects,
    sendOpenStudioInProject,
    socketProjects,
    openProjectInStudio
  }
}
const stringMyBody = (body: any) => {
  return JSON.stringify(body)
}
