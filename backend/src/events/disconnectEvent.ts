import { Server, Socket } from "socket.io";
import { gameDeleted } from "../globalEvents";
import { playerDisconnected } from "../serverState";

const disconnectEvent = (socket: Socket, io: Server) => {
  console.log(`a user disconnected with, socketid:${socket.id}`);
  const result = playerDisconnected(socket.id);
  if (result && result != 0) {
    io.in(result.toString()).emit(gameDeleted, { gameId: result });
  }
};

export default disconnectEvent;
