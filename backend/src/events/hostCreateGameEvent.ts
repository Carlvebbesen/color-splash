import { Server, Socket } from "socket.io";
import { game, player } from "../types/internalTypes";
import { addGame, getGame } from "../gameState";
import { error, gameCreated } from "../globalEvents";
import { createGame } from "../types/socketDataTypes";

export const hostCreateGameEvent = (
  socket: Socket,
  io: Server,
  data: createGame
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
    totalScore: 0,
  };
  const newGame: game = {
    gameId: gameId,
    hostId: host.socketId,
    maxRound: data.rounds ?? 4,
    maxPlayers: data.maxPlayers ?? 4,
    currentRound: 0,
    difficulty: data.difficulty ?? "easy",
    players: [host],
  };
  addGame(newGame);
  socket.emit(gameCreated, newGame);
  socket.join(gameId.toString());
  console.log(socket.rooms);
  console.log(`Dette er id til det nylig skapte game-room ${gameId}`);
};
