import { game, result } from "./internalTypes";

export interface ServerToClientEvents {
  EndRound: (roundResult: roundResult) => void;
  gameCreated: (game: game) => void;
}

interface roundResult {
  gameId: number;
  round: number;
  maxRound: number;
  result: result[];
}
