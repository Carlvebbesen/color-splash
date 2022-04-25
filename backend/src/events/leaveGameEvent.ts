import { onlyGameId } from "../types/socketDataTypes";
import { error, gameDeleted, gameInfo } from "../globalEvents";
import {
  checkValidGameForPlayer,
  deleteGame,
  getGame,
} from "../serverState/gameState";
import {
  deletePlayer,
  getPlayersFromGameReturnObject,
} from "../serverState/playerState";
import { Server, Socket } from "socket.io";

/**
 * Event sent from frontend when the client leaves the current game
 * @returns error if the player is not in a valid game
 * @returns the "gameInfo" event to the socket.io room if the game has not started yet.
 * @returns the "gameDeleted" event if the host leave the game.
 * @param io - the io instance for this server
 * @param socket - socket for the given player
 * @param data - dataObject containing the gameId
 */
export const leaveGameEvent = async (
  io: Server,
  socket: Socket,
  data: onlyGameId
) => {
  const msg = checkValidGameForPlayer(data.gameId, socket.id, false);
  if (msg !== "") {
    socket.emit(error, msg);
    return;
  }
  const game = getGame(data.gameId);
  const isHost = await deletePlayer(socket.id);
  if (game !== null && game.rounds.length === 0) {
    socket.to(game.gameId.toString()).emit(gameInfo, {
      playerCount: game.players.length,
      gameId: game.gameId,
      hostId: game.hostId,
      players: getPlayersFromGameReturnObject(game.gameId),
      rounds: game.maxRound,
      difficulty: game.difficulty,
    });
  }
  if (isHost) {
    socket.to(data.gameId.toString()).emit(gameDeleted, "Host ended the game");
    deleteGame(data.gameId);
  }
};
