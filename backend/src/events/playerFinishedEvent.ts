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
 * Player finishes round, and sends data for that particular round.
 * The relevant game is retrieved using the gameId from roundData.
 * The correct answer sequence is retrieved by matching roundNumber from
 * incoming roundData and the game`s roundArray. Then, playerscore is
 * calculated using utility method calculateScore.
 * @param socket - playerID for this player
 * @param roundData - all relevant data for this round, most important being answers
 *
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
  //Now we have to update player
  //Things that need to be updated
  //add a new played round for that particular player
  //score from this round is added to score from previous rounds
  playerPlayedRound(
    player.socketId,
    answerList,
    playerScore,
    game.gameId,
    timeUsed.total("millisecond")
  );
  //potentially the game could inifinitely loop, so we need to have a callback in frontend
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
