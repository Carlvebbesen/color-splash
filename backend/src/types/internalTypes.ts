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
  result: result[];
  timeEachRound: number;
}

export interface player {
  name: string;
  socketId: string;
  gameId: number;
  roundsPlayed: playerRound[] | [];
}

export interface playerRound {
  round: number;
  answer: string[];
  timeUsed: number;
  playerId: string;
  gameId: number;
  score: number;
}
export interface colors {
  round: number;
  gameId: number;
  colors: string[];
}
export interface result {
  playerId: string;
  nickname: string;
  score: number;
}
