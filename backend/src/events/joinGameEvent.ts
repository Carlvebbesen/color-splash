import { Server, Socket } from "socket.io";
import { gameIdNickname } from "../types/socketDataTypes";
import { error, gameInfo } from "../globalEvents";
import { addPlayer, getGame, getPlayersFromGame } from "../serverState";
import { player } from "../types/internalTypes";

export const joinGameEvent = (
  socket: Socket,
  io: Server,
  data: gameIdNickname
) => {
  const game = getGame(data.gameId);
  if (game === null) {
    socket.emit(error, "Game does not exist");
    return;
  }
  if (game.players.length >= game.maxPlayers) {
    socket.emit(error, "Game is full");
    return;
  }
  if (game.rounds.length > 0) {
    socket.emit(error, "Game is already started");
  }
  if (socket.rooms.size > 1) {
    socket.emit(
      error,
      "You are already in a game. Please leave the current game first."
    );
  }
  const player: player = {
    name: data.nickname ?? "player",
    socketId: socket.id,
    gameId: game.gameId,
    roundsPlayed: [],
  };
  addPlayer(game.gameId, player);
  socket.join(game.gameId.toString());
  io.in(game.gameId.toString()).emit(gameInfo, {
    playerCount: game.players.length,
    gameId: game.gameId,
    host: game.hostId,
    nickNames: getPlayersFromGame(game.gameId),
  });
  console.log(`player ${player.name} joined game ${game.gameId}`);
};