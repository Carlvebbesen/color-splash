import { Server, Socket } from "socket.io";
import { error, roundStarted, timesUp } from "../globalEvents";
import { getGame } from "../serverState";
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
      tid: game.timeEachRound,
      rundenummer: game.rounds.length,
      totaltrundenummer: game.maxRound,
      fargesekvens: game.rounds[game.rounds.length - 1],
    });
    setTimeout(
      () =>
        io.in(game.gameId.toString()).emit(timesUp, { gameId: data.gameId }),
      game.timeEachRound * 1000
    );
  }
};
