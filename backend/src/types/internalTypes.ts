export interface gameState {
  games: game[];
}

export interface game {
  gameId: number;
  hostId: string;
  maxRound: number;
  currentRound: number;
  difficulty: string;
  players: player[];
  maxPlayers: number;
}

export interface player {
  name: string;
  socketId: string;
  gameId: number;
  roundsPlayed: round[] | [];
  totalScore: number;
}

export interface round {
  round: number;
  answer: string[];
  timeUsed: number;
  playerId: string;
  gameId: number;
  score: number;
}
