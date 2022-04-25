import { Server, Socket } from "socket.io";
import { game, player } from "../types/internalTypes";
import { addGame, getGame } from "../serverState/gameState";
import { error, gameInfo } from "../globalEvents";
import { createGameData } from "../types/socketDataTypes";
import { getTimeForEachRoundMs } from "../utils";
import {
  addPlayerToServerAndGame,
  getPlayersFromGameReturnObject,
} from "../serverState/playerState";

/**
 * Event sent from frontend when the client creates a game. 
 * @returns error if the player is already in a game.
 * @returns the "gameInfo" event to the socket.io room if the game was created successfully.
 * @param io - the io instance for this server
 * @param socket - socket for the given player
 * @param data - dataObject containing:
 * rounds: number;
 * nickname: string;
 * difficulty: string;
 * maxPlayers: number;
 */
export const hostCreateGameEvent = (
  socket: Socket,
  io: Server,
  data: createGameData
) => {
  if (socket.rooms.size > 1) {
    socket.emit(
      error,
      "You are already in a game. Please leave the current game first."
    );
    return;
  }
  let gameId = Math.round((1 + Math.random()) * 10000);
  while (getGame(gameId) != null && gameId.toString().length == 5) {
    gameId = Math.round((1 + Math.random()) * 10000);
  }
  const host: player = {
    name: data.nickname ?? "playerHost",
    socketId: socket.id,
    gameId: gameId,
    roundsPlayed: [],
    avatarIndex: 0,
  };
  const newGame: game = {
    gameId: gameId,
    hostId: host.socketId,
    maxRound: data.rounds ?? 4,
    maxPlayers: data.maxPlayers ?? 4,
    difficulty: data.difficulty ?? "easy",
    players: [],
    rounds: [],
    timeEachRound: getTimeForEachRoundMs(data.difficulty),
  };
  addGame(newGame);
  addPlayerToServerAndGame(newGame.gameId, host);
  socket.emit(gameInfo, {
    playerCount: newGame.players.length,
    gameId: newGame.gameId,
    hostId: newGame.hostId,
    players: getPlayersFromGameReturnObject(newGame.gameId),
    rounds: newGame.maxRound,
    difficulty: newGame.difficulty,
  });
  socket.join(gameId.toString());
};
