import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { createStandaloneToast } from "@chakra-ui/react";

import { socketMessage } from "../../socketMessages";

const toast = createStandaloneToast();

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = "http://127.0.0.1:7891";

export const useSocket = () => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    //   @ts-ignore
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);
    //   @ts-ignore

    //   @ts-ignore
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        //   @ts-ignore
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      //   @ts-ignore
      setMessages((messages) => [...messages, incomingMessage]);
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

  //   @ts-ignore
  const sendMessage = (messageBody) => {
    //   @ts-ignore
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      //   @ts-ignore
      senderId: socketRef.current.id,
    });
  };
  const sendAllProjects = (messageBody: any) => {
    //   @ts-ignore
    socketRef.current.emit(socketMessage.ALL_PROJECTS, {
      body: stringMyBody(messageBody),
      //   @ts-ignore
      senderId: socketRef.current.id,
    });
  };

  return { messages, sendMessage, sendAllProjects };
};
const stringMyBody = (body: any) => {
  return JSON.stringify(body);
};
