import { useEffect, useRef, useState } from "react";
// import socketIOClient from "socket.io-client";
import socketIOClient from "socket.io-client";
import { createStandaloneToast } from "@chakra-ui/react";

import { socketMessage } from "../../socketMessages";

const toast = createStandaloneToast();

type UseSocketTypes = {
  windowsIp: string;
};
export const useSocket = (props: UseSocketTypes) => {
  const SOCKET_SERVER_URL = props && `http://${props.windowsIp}:7891`;
  const [socketProjects, setSocketProjects] = useState();
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
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

    return () => {
      //   @ts-ignore
      socketRef.current.disconnect();
    };
  }, []);
  useEffect(() => {
    if (socketRef.current) {
      // @ts-ignore
      if (socketRef.current.connected) {
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
    socketRef.current.emit(socketMessage.OPEN_IN_STUDIO, {
      body: stringMyBody(messageBody),
      senderId: socketRef.current.id,
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
    sendProjects,
    sendOpenStudioInProject,
    socketProjects,
  };
};
const stringMyBody = (body: any) => {
  return JSON.stringify(body);
};
