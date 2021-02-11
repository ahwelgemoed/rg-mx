import { useEffect, useRef, useState, useContext } from "react";
// import socketIOClient from "socket.io-client";
import socketIOClient from "socket.io-client";
import { createStandaloneToast } from "@chakra-ui/react";
import { RootStoreContext } from "../stores/RootStore";
import { socketMessage } from "../../socketMessages";

const toast = createStandaloneToast();

type UseSocketTypes = {
  windowsIp: string;
};
export const useSocket = (props: UseSocketTypes) => {
  console.log("props", props);
  const SOCKET_SERVER_URL = props && `http://${props.windowsIp}:7891`;
  const [socketProjects, setSocketProjects] = useState();
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  const projectStore = useContext(RootStoreContext);
  const [openProjectInStudio, setopenProjectInStudio] = useState<string>("");
  const socketRef = useRef<SocketIOClient.Socket>(
    socketIOClient(SOCKET_SERVER_URL)
  );

  useEffect(() => {
    //   @ts-ignore
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    socketRef.current.on("connect", () => {
      // setIsSocketConnected(true);
      console.log(socketRef.current.id);
    });
    socketRef.current.on("disconnect", () => {
      setIsSocketConnected(false);
      console.log("Disconnected");
    });
    socketRef.current.on(socketMessage.ALL_PROJECTS, (message: any) => {
      setSocketProjects(message);
    });
    socketRef.current.on(socketMessage.OPEN_IN_STUDIO, (message: any) => {
      console.log("OPEN_IN_VSCODE", message);
      setopenProjectInStudio(message);
      setTimeout(() => {
        setopenProjectInStudio("");
      }, 2000);
    });
    socketRef.current.on(socketMessage.OPEN_IN_WINDOWS_CMD, (message: any) => {
      const prjToOpen = JSON.parse(message.body);
      console.log("prjToOpen", prjToOpen);
      projectStore.projectsStore.openProjectInCMD(
        prjToOpen,
        projectStore.projectsStore.mendixProjectsPathMac
      );
    });
    return () => {
      //   @ts-ignore
      socketRef.current.disconnect();
    };
  }, []);
  useEffect(() => {
    if (socketRef.current) {
      console.log("1", socketRef.current);
      // @ts-ignore
      if (socketRef.current.connected) {
        console.log("2", socketRef.current);
        setIsSocketConnected(true);
        toast({
          title: "Windows Connected",
          status: "success",
          duration: 7000,
          position: "top",
          isClosable: true,
        });
      }
      if (socketRef.current.disconnected && isSocketConnected) {
        setIsSocketConnected(false);
        toast({
          title: "Windows Disconnected",
          status: "error",
          duration: 7000,
          position: "top",
          isClosable: true,
        });
      }
    }
  }, [socketRef.current]);

  const sendProjects = (messageBody: any) => {
    socketRef.current.compress(false).emit(socketMessage.ALL_PROJECTS, {
      messageBody: stringMyBody(messageBody),
    });
  };
  const sendOpenStudioInProject = (messageBody: any) => {
    console.log("messageBody", messageBody);
    socketRef.current.emit(socketMessage.OPEN_IN_STUDIO, {
      body: stringMyBody(messageBody),
      senderId: socketRef.current.id,
    });
    toast({
      title: `Opening ${messageBody}`,
      status: "success",
      duration: 7000,
      position: "top",
      isClosable: true,
    });
  };
  const sendOpenInCMD = (messageBody: any) => {
    socketRef.current.emit(socketMessage.OPEN_IN_WINDOWS_CMD, {
      body: stringMyBody(messageBody),
      senderId: socketRef.current.id,
    });
    console.log("SENT");
    toast({
      title: `Opening ${messageBody}`,
      status: "success",
      duration: 7000,
      position: "top",
      isClosable: true,
    });
  };
  const sendOpenInVsCode = (messageBody: any) => {
    socketRef.current.emit(socketMessage.OPEN_IN_VSCODE, {
      body: stringMyBody(messageBody),
      senderId: socketRef.current.id,
    });
  };

  return {
    isSocketConnected,
    sendOpenInVsCode,
    sendOpenInCMD,
    sendProjects,
    sendOpenStudioInProject,
    socketProjects,
    openProjectInStudio,
  };
};
const stringMyBody = (body: any) => {
  return JSON.stringify(body);
};
