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

export const updateGame = (game: game): boolean => {
  const oldGame: game = getGame(game.gameId);
  if (!oldGame) return false;
  gameData.games.map((g) => (oldGame.gameId === g.gameId ? { ...g, game } : g));
  return true;
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

export const updatePlayer = (updatedPlayer: player): boolean => {
  //updates a player with a
  const old: player = getPlayer(updatedPlayer.socketId);
  if (!old) return false;
  playerData.players.map((player) =>
    updatedPlayer.socketId === player.socketId
      ? { ...player, updatedPlayer }
      : player
  );
  return true;
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

export const getPlayerStateHTML = (): HTMLUListElement => {
  const playerList = document.createElement("ul");
  playerData.players.forEach((player) => {
    const playerItem = document.createElement("li");
    playerItem.innerHTML = `${player.name} is in game ${player.gameId} and have played: ${player.roundsPlayed}`;
    playerList.appendChild(playerItem);
  });
  return playerList;
};
export const getGameStateAsString = (): string => {
  let GameStateString = "Current GameState: \n";
  gameData.games.forEach((game) => {
    GameStateString += `Game ${game.gameId} with ${game.rounds.length} rounds played and ${game.difficulty} difficulty, And Players: `;
    game.players.forEach((playerId) => {
      const player = getPlayer(playerId);
      if (player) {
        GameStateString += `name: ${player.name} and rounds played: ${player.roundsPlayed.length} \n`;
      }
    });
    GameStateString += "\n";
  });
  return GameStateString;
};
