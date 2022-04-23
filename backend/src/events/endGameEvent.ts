import { error } from "../globalEvents";
import {
  checkValidGameForPlayer,
  deleteGame,
  getGame,
} from "../serverState/gameState";
import { Server, Socket } from "socket.io";
import { game } from "../types/internalTypes";
import { onlyGameId } from "../types/socketDataTypes";
import { deletePlayer } from "../serverState/playerState";

/**
 * Host sends game finished to server.
 * Backend checks that games hostId matches with socketId.
 * Then emits to everyone the endgame event, which frontend listens to
 * and sends every client (including host) back to start page and deletes
 * game corresponding to that id.
 * @param socket - socketId of host
 * @param gameId - id of game that is to be finished
 */
export const endGameEvent = (socket: Socket, io: Server, data: onlyGameId) => {
  //retrieves game from gamestate
  const msg = checkValidGameForPlayer(data.gameId, socket.id, true);
  if (msg !== "") {
    socket.emit(error, msg);
  }
  const game: game = getGame(data.gameId);
  if (socket.id === game.hostId) {
    deleteGame(data.gameId);
  } else {
    deletePlayer(socket.id);
  }
  //Then, we delete game from gamestate
};
