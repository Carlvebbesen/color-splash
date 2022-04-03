import { Server, Socket } from "socket.io";
import { getGame } from "../serverState";
import { displayColors, error } from "../globalEvents";
import { onlyGameId } from "../types/socketDataTypes";
import { generateColors } from "../utils";

export const startGameEvent = (
  socket: Socket,
  io: Server,
  data: onlyGameId
) => {
  const game = getGame(data.gameId);
  if (game === null) {
    socket.emit(error, "game does not exist");
    return;
  }
  if (game.hostId !== socket.id) {
    socket.emit(error, "you are not the host");
    return;
  }
  if (game.players.length < 2) {
    socket.emit(error, "not enough players");
    return;
  }
  if (game.rounds.length > 0) {
    socket.emit(error, "game is already started");
    return;
  }
  const roundColors = generateColors(game.difficulty);
  game.rounds.push({
    round: game.rounds.length + 1,
    gameId: data.gameId,
    colors: roundColors,
  });
  io.in(game.gameId.toString()).emit(displayColors, {
    gameId: game.gameId,
    round: game.rounds.length,
    maxRounds: game.maxRound,
    colors: roundColors,
  });
};
