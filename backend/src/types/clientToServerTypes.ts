export interface ClientToServerEvents {
  playerAnswer: (playerData: any) => void;
  playerRestartGame: (playerData: any) => void;
  hostCreateNewGame: (socket: any) => void;
  hostRoomFull: () => void;
  hostCountDownFinished: () => void;
  hostNextRound: () => void;
  hostGameOver: () => void;
  hostStartGame: () => void;
  PlayerFinished: (data: any) => void;
}
