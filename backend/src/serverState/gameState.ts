import { colors, game, gameState, result } from "../types/internalTypes";
import { deletePlayer, getPlayer } from "./playerState";
import { Temporal } from "@js-temporal/polyfill";

const gameData: gameState = {
  games: [],
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
    game.players.forEach((playerId) => deletePlayer(playerId));
    gameData.games = gameData.games.filter((game) => game.gameId !== gameId);
  }
};

export const getLastRound = (gameId: number): colors | null => {
  const game = getGame(gameId);
  if (!game) return null;
  return game.rounds[game.rounds.length - 1];
};

export const setRoundStartedTime = (gameId: number): boolean => {
  const game = getGame(gameId);
  if (game) {
    game.rounds[game.rounds.length - 1].roundStarted = Temporal.Now.instant();
    return true;
  }
  return false;
};

export const getGameStateAsString = (): string => {
  let gameStateString = `GameState: <br\>`;
  gameData.games.forEach((game) => {
    gameStateString += `Game ${game.gameId}.\t RoundsPlayed: ${game.rounds.length}.\tDifficulty: ${game.difficulty} playerCount: ${game.players.length}.<br\>`;
    gameStateString += `Players: <br\>`;
    game.players.forEach((playerId) => {
      const player = getPlayer(playerId);
      if (player) {
        gameStateString += `\tname: ${player.name}\t Roundsplayed: ${player.roundsPlayed.length}<br\>`;
      }
    });
    gameStateString += `<br\>`;
    gameStateString += `<br\>`;
  });
  return gameStateString;
};

export const getSortedResults = (gameId: number): result[] => {
  const game = getGame(gameId);
  const resultList: result[] = [];
  if (!game) return [];
  game.players.forEach((playerId) => {
    const player = getPlayer(playerId);
    if (player) {
      const totalScore = player.roundsPlayed.reduce((acc, round) => {
        return acc + round.score;
      }, 0);
      resultList.push({
        nickname: player.name,
        playerId: player.socketId,
        totalScore: totalScore,
        avatarIndex: player.avatarIndex,
      });
    }
  });
  return resultList.sort((a, b) => b.totalScore - a.totalScore);
};
export const checkValidGameForPlayer = (
  gameId: number,
  playerId: string,
  afterGameStarted: boolean
): string => {
  const game = getGame(gameId);
  if (!game) {
    return "Game does not exist";
  }
  if (afterGameStarted) {
    if (game.rounds.length === 0) {
      return "Game has not started yet";
    }
  } else {
    if (game.rounds.length > 0) {
      return "Game has already started";
    }
  }
  const player = getPlayer(playerId);
  if (!player) {
    return "Player does not exist";
  }
  if (!game.players.includes(playerId) || player.gameId !== gameId) {
    return "Player is not in this game";
  }

  return "";
};
