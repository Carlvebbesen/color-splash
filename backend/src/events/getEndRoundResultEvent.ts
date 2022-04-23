import { Socket, Server } from "socket.io";
import { onlyGameId } from "../types/socketDataTypes";
import { endRound, error } from "../globalEvents";
import {
  checkValidGameForPlayer,
  getGame,
  getSortedResults,
} from "../serverState/gameState";
import { game } from "../types/internalTypes";

export const getEndRoundResultEvent = (
  socket: Socket,
  io: Server,
  data: onlyGameId
) => {
  const msg = checkValidGameForPlayer(data.gameId, socket.id, true);
  if (msg !== "") {
    socket.emit(error, msg);
  }
  const game: game = getGame(data.gameId);
  if (game.hostId !== socket.id) {
    socket.emit(error, "you are not the host");
  }

  io.in(game.gameId.toString()).emit(endRound, {
    gameId: game.gameId,
    round: game.rounds.length,
    maxRound: game.maxRound,
    result: getSortedResults(game.gameId),
    hostId: game.hostId,
  });
};
