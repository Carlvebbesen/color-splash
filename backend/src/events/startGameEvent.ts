import { Server, Socket } from "socket.io";
import { checkValidGameForPlayer, getGame } from "../serverState/gameState";
import { displayColors, error } from "../globalEvents";
import { onlyGameId } from "../types/socketDataTypes";
import { generateColors } from "../utils";

/**
 * Event sent from frontend when the host-client wants to start the game
 * @returns error if the player is not host or not in a valid game
 * @returns the "displayColors" event to the socket.io room if the game should start displaying colors.
 * @param io - the io instance for this server
 * @param socket - socket for the given player
 * @param data - dataObject containing the gameId
 */
export const startGameEvent = (
  socket: Socket,
  io: Server,
  data: onlyGameId
) => {
  const msg = checkValidGameForPlayer(data.gameId, socket.id, false);
  if (msg !== "") {
    socket.emit(error, msg);
    return;
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
