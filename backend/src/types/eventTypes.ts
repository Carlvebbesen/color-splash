export interface ServerToClientEvents {
  hello: (a: string) => void;
  time: (a: string) => void;
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  newGameCreated: (object: any) => void;
  playerJoinedRoom: (gameID: any) => void;
  allPlayers: () => void;
  startGame: () => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  playerJoinGame: (gameID: any, name: any /*TODO definere player data type */ ) => void;
  playerAnswer: (playerData: any) => void;
  playerRestartGame: (playerData: any) => void;
  hostCreateNewGame: (socket: any) => void;
  hostRoomFull: () => void;
  hostCountDownFinished: () => void;
  hostNextRound: () => void;
  hostGameOver: () => void;
  hostStartGame : () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
