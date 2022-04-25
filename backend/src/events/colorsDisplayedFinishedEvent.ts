import { Server, Socket } from "socket.io";
import { error, roundStarted } from "../globalEvents";
import {
  checkValidGameForPlayer,
  getGame,
  setRoundStartedTime,
} from "../serverState/gameState";
import { onlyGameId } from "../types/socketDataTypes";

/**
 * Event sent from frontend when the client has finished displaying the colors
 * @returns the "roundStarted" event to the client if it was the host sending the event
 * @returns error if checkValidGameForPlayer returns a error string
 * @param io - the io instance for this server
 * @param socket - socket for the given player
 * @param data - dataObject containing the id of game that is to be finished
 */
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
