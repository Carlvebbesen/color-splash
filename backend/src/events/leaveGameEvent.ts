import { onlyGameId } from "../types/socketDataTypes";
import { error, gameDeleted, gameInfo } from "../globalEvents";
import { deleteGame, getGame } from "../serverState/gameState";
import {
  deletePlayer,
  getPlayersFromGameReturnObject,
} from "../serverState/playerState";
import { Server, Socket } from "socket.io";

export const leaveGameEvent = async (
  io: Server,
  socket: Socket,
  data: onlyGameId
) => {
  const game = getGame(data.gameId);
  if (game === null || !game.players.includes(socket.id)) {
    socket.emit(error, "Game does not exist");
    return;
  }
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
  socket.emit(gameDeleted, { gameId: game.gameId });
  const isHost = await deletePlayer(socket.id);
  console.log(isHost);
  if (isHost) {
    socket
      .to(data.gameId.toString())
      .emit(gameDeleted, { gameId: game.gameId });
    deleteGame(data.gameId);
  }
};
