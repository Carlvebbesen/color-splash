import { Server, Socket } from "socket.io";
import { deleteGame } from "../serverState/gameState";
import { gameDeleted } from "../globalEvents";
import { playerDisconnected } from "../serverState/playerState";

const disconnectEvent = async (socket: Socket, io: Server) => {
  console.log(`a user disconnected with, socketid:${socket.id}`);
  const isHostOrLast = await playerDisconnected(socket.id);
  console.log(`Result disconnected: ${isHostOrLast}`);
  if (isHostOrLast && isHostOrLast != 0) {
    io.in(isHostOrLast.toString()).emit(gameDeleted, { gameId: isHostOrLast });
    deleteGame(isHostOrLast);
  }
};

export default disconnectEvent;
