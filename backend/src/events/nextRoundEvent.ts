import { displayColors, gameFinished } from "../globalEvents";
import { error } from "../globalEvents";
import { Server, Socket } from "socket.io";
import {
  checkValidGameForPlayer,
  getGame,
  getSortedResults,
} from "../serverState/gameState";
import { generateColors } from "../utils";
import { onlyGameId } from "../types/socketDataTypes";

/**
 * Event sent from frontend when the client creates a game.
 * @returns error if it is a valid game
 * @returns the "displayColors" event to the socket.io room if the game has more rounds.
 * @returns the "gameFinished" event to the socket.io room if the game is finished.
 * @param io - the io instance for this server
 * @param socket - socket for the given player
 * @param data - dataObject containing the gameId
 */
export const nextRoundEvent = (
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
  if (socket.id !== game.hostId) {
    socket.emit(error, "You are not the host");
  }

  //Checks if max rounds is reached,
  if (game.rounds.length == game.maxRound) {
    io.in(game.gameId.toString()).emit(gameFinished, {
      gameId: game.gameId,
      results: getSortedResults(game.gameId),
      rounds: game.rounds.length,
      maxRounds: game.maxRound,
    });
  }

  //adds new colors to the next round
  else {
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
  }
};
