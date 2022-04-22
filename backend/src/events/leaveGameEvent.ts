import { onlyGameId } from "../types/socketDataTypes";
import { error } from "../globalEvents";
import { deleteGame, getGame } from "../serverState/gameState";
import { deletePlayer } from "../serverState/playerState";
import { Server, Socket } from "socket.io";

export const leaveGameEvent = (
  io: Server,
  socket: Socket,
  data: onlyGameId
) => {
  const game = getGame(data.gameId);
  if (game) {
    socket.emit(error, "Game does not exist");
  }
  const isHost = deletePlayer(socket.id);
  if (isHost || game.players.length === 0) {
    io.in(data.gameId.toString()).emit(error, "Game deleted");
    deleteGame(data.gameId);
  }
};
