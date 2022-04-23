import { Server, Socket } from "socket.io";
import { deleteGame, getGame } from "../serverState/gameState";
import { gameDeleted, gameInfo } from "../globalEvents";
import {
  getPlayer,
  getPlayersFromGameReturnObject,
  playerDisconnected,
} from "../serverState/playerState";

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
    io.in(isHostOrLast.toString()).emit(gameDeleted, { gameId: isHostOrLast });
    deleteGame(isHostOrLast);
  }
};

export default disconnectEvent;
