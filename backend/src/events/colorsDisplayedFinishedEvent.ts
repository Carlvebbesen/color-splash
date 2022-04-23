import { Server, Socket } from "socket.io";
import {
  allPlayersHavePlayed,
  getPlayerIdsNotPlayedRound,
} from "../serverState/playerState";
import { error, roundStarted } from "../globalEvents";
import {
  checkValidGameForPlayer,
  getGame,
  setRoundStartedTime,
} from "../serverState/gameState";
import { onlyGameId } from "../types/socketDataTypes";

export const colorsDisplayedFinishedEvent = (
  socket: Socket,
  io: Server,
  data: onlyGameId
) => {
  const msg = checkValidGameForPlayer(data.gameId, socket.id, true);
  if (msg !== "") {
    socket.emit(error, msg);
    return;
  }
  const game = getGame(data.gameId);
  if (game.hostId === socket.id) {
    io.in(game.gameId.toString()).emit(roundStarted, {
      gameId: game.gameId,
      round: game.rounds.length,
      maxRound: game.maxRound,
      colors: game.rounds[game.rounds.length - 1].colors,
    });
    if (!setRoundStartedTime(game.gameId)) {
      socket.emit(error, "could not set round started time");
      return;
    }
  }
};
