export interface createGame {
  rounds: number;
  nickname: string;
  difficulty: string;
  maxPlayers: number;
}

export interface playerJoinGame {
  nickname: string;
  gameId: number;
}
