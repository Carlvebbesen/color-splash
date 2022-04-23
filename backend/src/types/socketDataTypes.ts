export interface createGameData {
  rounds: number;
  nickname: string;
  difficulty: string;
  maxPlayers: number;
}

export interface gameIdNickname {
  nickname: string;
  gameId: number;
}
export interface onlyGameId {
  gameId: number;
}
export interface playerAnswerGameId {
  gameId: number;
  answer: string;
}
