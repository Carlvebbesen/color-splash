import { game, result } from "./internalTypes";

export interface ServerToClientEvents {
  EndRound: (roundResult: RoundResult) => void;
  gameCreated: (game: game) => void;
}

interface RoundResult {
  gameId: number;
  round: number;
  maxRound: number;
  result: result[];
  hostId: string;
}

export interface ReturnObjectPlayer {
  name: string;
  avatarIndex: number;
}
