export interface ClientToServerEvents {
  hello: () => void;
  playerJoinGame: (
    gameID: any,
    name: any /*TODO definere player data type */
  ) => void;
  playerAnswer: (playerData: any) => void;
  playerRestartGame: (playerData: any) => void;
  hostCreateNewGame: (socket: any) => void;
  hostRoomFull: () => void;
  hostCountDownFinished: () => void;
  hostNextRound: () => void;
  hostGameOver: () => void;
  hostStartGame: () => void;
}
