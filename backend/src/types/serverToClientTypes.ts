export interface ServerToClientEvents {
  time: (a: string) => void;
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  newGameCreated: (object: any) => void;
  playerJoinedRoom: (gameID: any) => void;
  allPlayers: () => void;
  startGame: () => void;
  roundScore: (score: number) => void;
  gameCreated: (game: any) => void;
}
