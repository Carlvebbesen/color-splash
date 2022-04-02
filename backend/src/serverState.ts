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
  const index = gameData.games.indexOf(getGame(gameId) ?? null);
  if (index > -1) {
    gameData.games[index].players.forEach((playerId) => deletePlayer(playerId));
    gameData.games.splice(index, 1);
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
export const playerDisconnected = (socketId: string): number => {
  const player = playerData.players.find(
    (player) => player.socketId === socketId
  );
  if (player) {
    const isHost = deletePlayer(socketId);
    if (isHost || getGame(player.gameId).players.length === 0) {
      deleteGame(player.gameId);
      return player.gameId;
    }
    return 0;
  }
};
export const deletePlayer = (playerId: string): boolean => {
  //returns boolean true if the player was the host
  const index = playerData.players.indexOf(getPlayer(playerId) ?? null);
  const game = getGame(getPlayer(playerId).gameId);
  if (index > -1) {
    playerData.players.splice(index, 1);
    const playerIdIndex = game.players.indexOf(playerId);
    game.players.splice(playerIdIndex, 1);
    return game.hostId == playerId;
  }
};

export const getPlayersFromGame = (gameId: number): player[] => {
  return getGame(gameId)?.players.map((playerId) => getPlayer(playerId)) ?? [];
};
//returns boolean true if the player was the host
