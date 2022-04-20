import { Server, Socket } from "socket.io";
import { game, player } from "../types/internalTypes";
import { addGame, getGame } from "../serverState/gameState";
import { error, gameCreated } from "../globalEvents";
import { createGameData } from "../types/socketDataTypes";
import { getTimeForEachRoundMs } from "../utils";
import { addPlayerToServerAndGame } from "../serverState/playerState";

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
  let gameId = (Math.random() * 100000) | 0;
  while (getGame(gameId) != null) {
    gameId = (Math.random() * 100000) | 0;
  }
  const host: player = {
    name: data.nickname ?? "playerHost",
    socketId: socket.id,
    gameId: gameId,
    roundsPlayed: [],
  };
  const newGame: game = {
    gameId: gameId,
    hostId: host.socketId,
    maxRound: data.rounds ?? 4,
    maxPlayers: data.maxPlayers ?? 4,
    difficulty: data.difficulty ?? "easy",
    players: [],
    rounds: [],
    result: [],
    timeEachRound: getTimeForEachRoundMs(data.difficulty),
  };
  addGame(newGame);
  addPlayerToServerAndGame(newGame.gameId, host);
  console.log(newGame);
  socket.emit(gameCreated, newGame);
  socket.join(gameId.toString());
  console.log(`Dette er id til det nylig skapte game-room ${gameId}`);
  console.log(`Laget av spilleren: ${host.name}`);
};
