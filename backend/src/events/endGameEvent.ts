import { error } from "../globalEvents";
import {
  checkValidGameForPlayer,
  deleteGame,
  getGame,
} from "../serverState/gameState";
import { Server, Socket } from "socket.io";
import { onlyGameId } from "../types/socketDataTypes";
import { deletePlayer } from "../serverState/playerState";

/**
 * Host sends game finished to server.
 * Backend checks that games hostId matches with socketId.
 * Backend deletes the player from the game.
 * if the player is the host the game and all the players is deleted.
 * @param socket - socketId of host
 * @param io - socket.io instance
 * @param data - an object containing the gameId
 */
export const endGameEvent = (socket: Socket, io: Server, data: onlyGameId) => {
  //retrieves game from gamestate
  const game = getGame(data.gameId);
  if (game) {
    const msg = checkValidGameForPlayer(data.gameId, socket.id, true);
    if (msg !== "") {
      socket.emit(error, msg);
      return;
    }
    if (socket.id === game.hostId) {
      deleteGame(data.gameId);
    } else {
      deletePlayer(socket.id);
    }
  }
};
