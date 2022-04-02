import { Socket } from "socket.io";
import { io } from "./server";
import { game, gameState, player, playerState } from "./types/internalTypes";
const gameData: gameState = {
  games: [],
};
const playerData: playerState = {
  players: [],
};
export const addGame = (newGame: game): void => {
  gameData.games.push(newGame);
};
export const getGame = (gameId: number): game | null => {
  return gameData.games.find((game) => game.gameId === gameId) ?? null;
};
export const deleteGame = (gameId: number) => {
  const game = getGame(gameId);
  if (game) {
    gameData.games = gameData.games.filter((game) => game.gameId !== gameId);
    game.players.forEach((playerId) => deletePlayer(playerId));
  }
};
export const addPlayer = (gameId: number, newPlayer: player): void => {
  playerData.players.push(newPlayer);
  gameData.games
    .find((game) => game.gameId === gameId)
    ?.players.push(newPlayer.socketId);
};
export const getPlayer = (playerId: string): player | null => {
  return (
    playerData.players.find((player) => player.socketId === playerId) ?? null
  );
};
export const playerDisconnected = async (socketId: string): Promise<number> => {
  const player = playerData.players.find(
    (player) => player.socketId === socketId
  );
  if (player) {
    const isHost = await deletePlayer(socketId);
    if (isHost || getGame(player.gameId).players.length === 0) {
      deleteGame(player.gameId);
      return player.gameId;
    }
  }
  return 0;
};
export const deletePlayer = async (playerId: string): Promise<boolean> => {
  //returns boolean true if the player was the host
  const index = playerData.players.indexOf(getPlayer(playerId) ?? null);
  const game = getGame(getPlayer(playerId).gameId);
  if (index > -1) {
    playerData.players.splice(index, 1);
    game.players = game.players.filter((player) => player !== playerId);
    (await io.fetchSockets()).forEach((socket) => {
      if (socket.id === playerId) {
        socket.leave(game.gameId.toString());
      }
    });
    return game.hostId == playerId;
  }
};

export const getPlayersFromGame = (gameId: number): player[] => {
  console.log(getGame(gameId));
  return (
    getGame(gameId)
      ?.players.map((playerId) => getPlayer(playerId))
      .filter((player) => player !== null) ?? []
  );
};
