import { Server, Socket } from "socket.io";
import { deleteGame, getGame } from "../serverState/gameState";
import { gameDeleted, gameInfo } from "../globalEvents";
import {
  getPlayer,
  getPlayersFromGameReturnObject,
  playerDisconnected,
} from "../serverState/playerState";
/**
 * Event sent from frontend when the client disconnects from the server
 * @returns the "gameInfo" event to all clients in the game if the game has not started yet
 * @returns the "gameDeleted" event to all clients in the game if the game has started and the player was host or last player
 * @param io - the io instance for this server
 * @param socket - socket for the given player
 */
const disconnectEvent = async (socket: Socket, io: Server) => {
  const game = getGame(getPlayer(socket.id)?.gameId);
  const isHostOrLast = await playerDisconnected(socket.id);
  if (game !== null && game.rounds.length === 0) {
    io.in(game.gameId.toString()).emit(gameInfo, {
      playerCount: game.players.length,
      gameId: game.gameId,
      hostId: game.hostId,
      players: getPlayersFromGameReturnObject(game.gameId),
      rounds: game.maxRound,
      difficulty: game.difficulty,
    });
  }
  if (isHostOrLast && isHostOrLast != 0) {
    io.in(isHostOrLast.toString()).emit(gameDeleted, "Host ended the game");
    deleteGame(isHostOrLast);
  }
};

export default disconnectEvent;
