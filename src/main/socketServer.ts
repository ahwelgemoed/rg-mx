const http = require("http").createServer();
const socketIOServer = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

import { socketMessage } from "../socketMessages";
export const initiateSocket = () => {
  console.log("SOCKET");

  socketIOServer.on("connection", (socket: any) => {
    console.info(`Client connected [id=${socket.id}]`);

    socket.broadcast.emit("broadcast", "hello friends!");

    // initialize this client's sequence number
    socket.on(socketMessage.ALL_PROJECTS, (data: any) => {
      console.log("ALL_PROJECTS", data);
      socket.broadcast.emit(socketMessage.ALL_PROJECTS, data);
    });
    socket.on(socketMessage.OPEN_IN_STUDIO, (data: any) => {
      console.log("OPEN_IN_STUDIO", data);
    });
    socket.on(socketMessage.OPEN_IN_VSCODE, (data: any) => {
      console.log("OPEN_IN_VSCODE", data);
    });

    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
      console.info(`Client gone [id=${socket.id}]`);
    });
  });
};
export const initiateServer = http.listen(7891);

//   (async () => {

//   })();
