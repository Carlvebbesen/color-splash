import { Server, Socket } from "socket.io";
import { gameIdNickname } from "../types/socketDataTypes";
import { error, gameInfo } from "../globalEvents";
import { getGame } from "../serverState/gameState";
import { player } from "../types/internalTypes";
import {
  addPlayerToServerAndGame,
  getPlayersFromGameReturnObject,
} from "../serverState/playerState";

/**
 * Event sent from frontend when the client want to join a game
 * @returns error if the player is already in a game or game is full
 * @returns the "gameInfo" event to the socket.io room if the player joined successfully.
 * @param io - the io instance for this server
 * @param socket - socket for the given player
 * @param data - dataObject containing:
 * gameId: number;
 * nickname: string;
 */
export const joinGameEvent = (
  socket: Socket,
  io: Server,
  data: gameIdNickname
) => {
  const game = getGame(data.gameId);
  if (!game) {
    socket.emit(error, "game does not exist");
    return;
  }
  if (game.players.length >= game.maxPlayers) {
    socket.emit(error, "Game is full");
    return;
  }
  if (socket.rooms.size > 1) {
    socket.emit(
      error,
      "You are already in a game. Please leave the current game first."
    );
    return;
  }
  const player: player = {
    name: data.nickname ?? "player",
    socketId: socket.id,
    gameId: game.gameId,
    roundsPlayed: [],
    avatarIndex: game.players.length,
  };
  addPlayerToServerAndGame(game.gameId, player);
  socket.join(game.gameId.toString());
  io.in(game.gameId.toString()).emit(gameInfo, {
    playerCount: game.players.length,
    gameId: game.gameId,
    hostId: game.hostId,
    players: getPlayersFromGameReturnObject(game.gameId),
    rounds: game.maxRound,
    difficulty: game.difficulty,
  });
};
