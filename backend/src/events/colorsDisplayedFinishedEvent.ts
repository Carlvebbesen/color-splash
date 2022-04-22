import { Server, Socket } from "socket.io";
import {
  allPlayersHavePlayed,
  getPlayerIdsNotPlayedRound,
} from "../serverState/playerState";
import { error, roundStarted, timesUp } from "../globalEvents";
import { getGame, setRoundStartedTime } from "../serverState/gameState";
import { onlyGameId } from "../types/socketDataTypes";

export const colorsDisplayedFinishedEvent = (
  socket: Socket,
  io: Server,
  data: onlyGameId
) => {
  const game = getGame(data.gameId);
  if (!game) {
    socket.emit(error, "game does not exist");
    return;
  }
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

    setTimeout(async () => {
      if (!allPlayersHavePlayed(game.gameId, game.rounds.length)) {
        const players = getPlayerIdsNotPlayedRound(
          game.gameId,
          game.rounds.length
        );
        (await io.fetchSockets()).forEach((socket) => {
          if (players.includes(socket.id)) {
            socket.emit(timesUp, {
              gameId: game.gameId,
              round: game.rounds.length,
            });
          }
        });
      }
    }, game.timeEachRound);
  }
};
