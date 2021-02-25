import { socketMessage } from "../socketMessages";

const http = require("http").createServer();
const socketIOServer = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
export const initiateSocket = () => {
  socketIOServer.on("connection", (socket: any) => {
    socket.broadcast.emit(socketMessage.NEW_CLIENT, "");

    socket.on(socketMessage.ALL_PROJECTS, (data: any) => {
      socket.broadcast.emit(socketMessage.ALL_PROJECTS, data);
    });
    socket.on(socketMessage.OPEN_IN_STUDIO, (data: any) => {
      socket.broadcast.emit(socketMessage.OPEN_IN_STUDIO, data);
    });
    socket.on(socketMessage.OPEN_IN_WINDOWS_CMD, (data: any) => {
      socket.broadcast.emit(socketMessage.OPEN_IN_WINDOWS_CMD, data);
    });
    socket.on(socketMessage.CLIENT_ONLINE, (data: any) => {
      console.log("Client Online Server", data);
      socket.broadcast.emit(socketMessage.CLIENT_ONLINE, data);
    });
    socket.on(socketMessage.RESET, (data: any) => {
      socket.broadcast.emit(socketMessage.RESET, data);
    });

    socket.on("disconnect", () => {
      console.info(`Client gone [id=${socket.id}]`);
    });
  });
};
export const initiateServer = http.listen(7891);
