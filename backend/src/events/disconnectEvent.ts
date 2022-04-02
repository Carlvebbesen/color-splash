import { Server, Socket } from "socket.io";
import { gameDeleted } from "../globalEvents";
import { playerDisconnected } from "../serverState";

const disconnectEvent = async (socket: Socket, io: Server) => {
  console.log(`a user disconnected with, socketid:${socket.id}`);
  const result = await playerDisconnected(socket.id);
  console.log(`Result disconnected: ${result}`);
  if (result && result != 0) {
    io.in(result.toString()).emit(gameDeleted, { gameId: result });
  }
};

export default disconnectEvent;
