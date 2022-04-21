import { Temporal } from "@js-temporal/polyfill";

export interface gameState {
  games: game[];
}
export interface playerState {
  players: player[];
}

export interface game {
  gameId: number;
  hostId: string;
  maxRound: number;
  rounds: colors[];
  difficulty: string;
  players: string[];
  maxPlayers: number;
  timeEachRound: number;
}

export interface player {
  name: string;
  socketId: string;
  gameId: number;
  roundsPlayed: playerRound[];
  avatarIndex: number;
}

export interface playerRound {
  round: number;
  answer: number[];
  timeUsed: number;
  playerId: string;
  gameId: number;
  score: number;
}
export interface colors {
  round: number;
  gameId: number;
  colors: number[];
  roundStarted: Temporal.Instant | null;
}
export interface result {
  playerId: string;
  nickname: string;
  totalScore: number;
  avatarIndex: number;
}
