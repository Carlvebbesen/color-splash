import { Server, Socket } from "socket.io";
import { error, gameInfo } from "../globalEvents";
import { addPlayer, getGame } from "../gameState";
import { player } from "../types/internalTypes";
import { playerJoinGame } from "../types/socketDataTypes";

export const joinGameEvent = (
  socket: Socket,
  io: Server,
  newPlayer: playerJoinGame
) => {
  const game = getGame(newPlayer.gameId);
  if (game === null) {
    socket.emit(error, "Game does not exist");
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
  }
  const player: player = {
    name: newPlayer.nickname ?? "player",
    socketId: socket.id,
    gameId: game.gameId,
    roundsPlayed: [],
    totalScore: 0,
  };
  addPlayer(game.gameId, player);
  socket.join(game.gameId.toString());
  io.in(game.gameId.toString()).emit(gameInfo, {
    playerCount: game.players.length,
    gameId: game.gameId,
    host: game.hostId,
    nickNames: game.players.map((player) => player.name),
  });
  console.log(`player ${player.name} joined game ${game.gameId}`);
};
