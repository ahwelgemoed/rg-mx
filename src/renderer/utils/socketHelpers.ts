import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = "http://127.0.0.1:7891";

const useChat = () => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    //   @ts-ignore
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

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

  //   @ts-ignore
  const sendMessage = (messageBody) => {
    //   @ts-ignore
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      //   @ts-ignore
      senderId: socketRef.current.id,
    });
  };

  return { messages, sendMessage };
};

export default useChat;
