import { Socket } from "socket.io";
import { calculateScore } from "../utils";
import { endRound, error } from "../globalEvents";
import {
  allPlayersHavePlayed,
  getPlayer,
  playerPlayedRound,
} from "../serverState/playerState";
import {
  checkValidGameForPlayer,
  getGame,
  getLastRound,
  getSortedResults,
} from "../serverState/gameState";
import { playerAnswerGameId } from "../types/socketDataTypes";
import { Temporal } from "@js-temporal/polyfill";
import { io } from "../server";

/**
 * Event sent from frontend when the client is finished with a round
 * @returns error if it is not a valid game
 * @returns the "endRound" event to the socket.io room if all players in the room successfully played their round
 * @param socket - socket for the given player
 * @param roundData - dataObject containing:
 * answer: string;
 * gameId: number;
 */
export const playerFinishedEvent = (
  socket: Socket,
  roundData: playerAnswerGameId
) => {
  const msg = checkValidGameForPlayer(roundData.gameId, socket.id, true);
  if (msg !== "") {
    socket.emit(error, msg);
    return;
  }
  const timeNow = Temporal.Now.instant();
  const game = getGame(roundData.gameId);
  let player = getPlayer(socket.id);
  const answerList: number[] = roundData.answer
    .split("")
    .map((answer) => parseInt(answer));
  const round = getLastRound(game.gameId);
  if (!round) {
    socket.emit(error, "Round could not be found");
  }
  const timeUsed =
    timeNow.since(round.roundStarted) ??
    Temporal.Duration.from({ milliseconds: game.timeEachRound });
  //calculates score for this particular round
  const playerScore: number = calculateScore(
    answerList,
    round.colors,
    timeUsed.total("millisecond") > game.timeEachRound
      ? game.timeEachRound
      : timeUsed.total("millisecond"),
    game.timeEachRound
  );

  playerPlayedRound(
    player.socketId,
    answerList,
    playerScore,
    game.gameId,
    timeUsed.total("millisecond")
  );
  if (allPlayersHavePlayed(game.gameId, round.round)) {
    io.in(game.gameId.toString()).emit(endRound, {
      gameId: game.gameId,
      round: round.round,
      maxRound: game.maxRound,
      result: getSortedResults(game.gameId),
      hostId: game.hostId,
    });
  }
};
