import { game, gameState, player } from "./types/internalTypes";
const gameData: gameState = {
  games: [],
};
export const addGame = (newGame: game): void => {
  gameData.games.push(newGame);
};
export const getGame = (gameId: number): game => {
  console.log(gameData.games.find((game) => game.gameId === gameId));
  return gameData.games.find((game) => game.gameId === gameId) ?? null;
};
export const removeGame = (gameId: number) => {
  const index = gameData.games.indexOf(getGame(gameId) ?? null);
  if (index > -1) {
    gameData.games.splice(index, 1);
  }
};
export const addPlayer = (gameId: number, newPlayer: player): void => {
  gameData.games
    .find((game) => game.gameId === gameId)
    ?.players.push(newPlayer);
};
export const getPlayer = (gameId: number, playerId: string): player | null => {
  return (
    gameData.games
      .find((game) => game.gameId === gameId)
      .players.find((player) => player.socketId === playerId) ?? null
  );
};
export const playerDisconnected = (socketId: string): void => {
  gameData.games.forEach((game) => {
    const player = game.players.find((player) => player.socketId === socketId);
    if (player) {
      removePlayer(game.gameId, socketId);
    }
  });
};
export const removePlayer = (gameId: number, playerId: string) => {
  const index = getGame(gameId)?.players.indexOf(
    getPlayer(gameId, playerId) ?? null
  );
  if (index > -1) {
    getGame(gameId)?.players.splice(index, 1);
  }
};
