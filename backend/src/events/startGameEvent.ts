import { Server, Socket } from "socket.io";
import { checkValidGameForPlayer, getGame } from "../serverState/gameState";
import { displayColors, error } from "../globalEvents";
import { onlyGameId } from "../types/socketDataTypes";
import { generateColors } from "../utils";

export const startGameEvent = (
  socket: Socket,
  io: Server,
  data: onlyGameId
) => {
  const msg = checkValidGameForPlayer(data.gameId, socket.id, false);
  if (msg !== "") {
    socket.emit(error, msg);
  }
  const game = getGame(data.gameId);
  if (game.hostId !== socket.id) {
    socket.emit(error, "you are not the host");
    return;
  }
  const roundColors = generateColors(game.difficulty);
  game.rounds.push({
    round: game.rounds.length + 1,
    gameId: data.gameId,
    colors: roundColors,
    roundStarted: null,
  });
  io.in(game.gameId.toString()).emit(displayColors, {
    gameId: game.gameId,
    round: game.rounds.length,
    maxRounds: game.maxRound,
    colors: roundColors,
  });
};
