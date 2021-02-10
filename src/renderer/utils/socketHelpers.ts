import { useEffect, useRef, useState } from "react";
// import socketIOClient from "socket.io-client";
import socketIOClient from "socket.io-client";
import { createStandaloneToast } from "@chakra-ui/react";

import { socketMessage } from "../../socketMessages";

const toast = createStandaloneToast();

const SOCKET_SERVER_URL = "http://10.211.55.4:7891";

export const useSocket = () => {
  const [socketProjects, setSocketProjects] = useState();
  const socketRef = useRef<SocketIOClient.Socket>(
    socketIOClient(SOCKET_SERVER_URL)
  );

  useEffect(() => {
    //   @ts-ignore
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    socketRef.current.on("connect", () => {
      console.log(socketRef.current.id);
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
        toast({
          title: "Windows Connected",
          status: "success",
          duration: 7000,
          position: "top",
          isClosable: true,
        });
      }
    }
  }, [socketRef]);

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

  const isSocketConnected =
    socketRef && socketRef.current && socketRef.current.connected;

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
