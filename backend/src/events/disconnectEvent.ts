import { Server, Socket } from "socket.io";
import { playerDisconnected } from "../gameState";

const disconnectEvent = (socket: Socket, io: Server) => {
  console.log(`a user disconnected with, socketid:${socket.id}`);
  playerDisconnected(socket.id);
};

export default disconnectEvent;
