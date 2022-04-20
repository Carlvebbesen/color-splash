import { Server, Socket } from "socket.io";
import { error, roundStarted, timesUp } from "../globalEvents";
import { deleteLastRound, getGame, setRoundStartedTime } from "../serverState/gameState";
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
      colors: game.rounds[game.rounds.length - 1],
    });
    if(!setRoundStartedTime(game.gameId)){
      socket.emit(error, "could not set round started time");
      return;
    }

    setTimeout(
      () =>
        io.in(game.gameId.toString()).emit(timesUp, { gameId: data.gameId }),
      game.timeEachRound
    );
  }
};
