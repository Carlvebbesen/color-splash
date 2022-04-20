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
    gameData.games = gameData.games.filter((game) => game.gameId !== gameId);
    game.players.forEach((playerId) => deletePlayer(playerId));
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
export const deleteLastRound = (gameId: number): void => {
  const game = getGame(gameId);
  if (game) {
    game.rounds.pop();
  }
};

export const getGameStateAsString = (): string => {
  let gameStateString = `Current GameState: <br\>`;
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
  });
  return gameStateString;
};
export const getResultForAPlayer = (
  gameId: number,
  playerId: string
): result => {
  const game = getGame(gameId);
  if (game) {
    return game.result.find((result) => result.playerId === playerId) ?? null;
  }
  return null;
};

export const addPlayerScoreToGameResults = (
  playerId: string,
  gameId: number,
  score: number
): result | null => {
  const result = getResultForAPlayer(gameId, playerId);

  if (result) {
    result.totalScore += score;
    return result;
  }
  const game = getGame(gameId);
  if (game) {
    game.result.push({
      totalScore: score,
      nickname: getPlayer(playerId)?.name ?? "player",
      playerId: playerId,
    });
    return {
      totalScore: score,
      nickname: getPlayer(playerId)?.name ?? "player",
      playerId: playerId,
    };
  }
  return null;
};

export const getSortedResults = (gameId: number): result[] => {
  const game = getGame(gameId);
  if (game) {
    return game.result.sort((a, b) => b.totalScore - a.totalScore);
  }
  return [];
};
