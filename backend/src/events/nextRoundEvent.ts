import { displayColors, gameFinished } from "../globalEvents";
import { error } from "../globalEvents";
import { Server, Socket } from "socket.io";
import {
  checkValidGameForPlayer,
  getGame,
  getSortedResults,
} from "../serverState/gameState";
import { getPlayer } from "../serverState/playerState";
import { generateColors } from "../utils";
import { onlyGameId } from "../types/socketDataTypes";

/**
 * Takes in a gameID and a socketId/playerID.
 * Finds game from gameID, and checks if hostId matches with socketId
 * Then generates a new round, with new randomized colors and
 * updates the corresponding datastructurs to reflect new round.
 *
 * @param socket - host socket
 * @param gameId - gameId for a particular game
 */
export const nextRoundEvent = (
  socket: Socket,
  io: Server,
  data: onlyGameId
) => {
  const msg = checkValidGameForPlayer(data.gameId, socket.id, true);
  if (msg !== "") {
    socket.emit(error, msg);
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
