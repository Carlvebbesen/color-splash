import { Socket } from "socket.io";
import { calculateScore } from "../utils";
import { error, roundScore } from "../globalEvents";
import { getGame, getPlayer, updateGame, updatePlayer } from "../serverState";
import { player, playerRound, result } from "../types/internalTypes";

/**
 * Player finishes round, and sends data for that particular round.
 * The relevant game is retrieved using the gameId from roundData.
 * The correct answer sequence is retrieved by matching roundNumber from 
 * incoming roundData and the game`s roundArray. Then, playerscore is
 * calculated using utility method calculateScore.
 * Players round
 * @param socket - playerID for this player 
 * @param roundData - all relevant data for this round, most important being answers
 * 
 */
export const playerFinishedEvent = (socket: Socket, roundData: playerRound) => {
    //Gets game from gameID passed in roundData
    const game = getGame(roundData.gameId);
    if (!game) {
        socket.emit(error, "Game could not be found");
        return;
    }
    //TODO
    //Get specific player from playerState, and update that player
    //Get specific answer array from correct round from game
    //Round data contains correct color sequence for a specific round
    let correctAnswers: string[];
    game.rounds.map(round => 
        round.round === roundData.round ? correctAnswers = round.colors : void(0) //do nothing if false
    )
    //calculates score for this particular round
    const playerScore: number = calculateScore(roundData.answer, correctAnswers, roundData.timeUsed, game.timeEachRound);
    if (playerScore < 0) {
        socket.emit(error, "Answer sequences were different");
        return;
    }
    let player: player = getPlayer(roundData.playerId);
    //Now we have to update player
    //Things that need to be updated
    //add a new played round for that particular player
    //score from this round is added to score from previous rounds
    const playedRound = {...roundData, score: roundData.score + playerScore};
    player = {...player, roundsPlayed: [...player.roundsPlayed, playedRound]}
    const updated = updatePlayer(player)
    const playerResult: result = {
        playerId: player.socketId,
        nickname: player.name,
        score: roundData.score + playerScore
    }
    //Games result array is updated
    game.result = [...game.result, playerResult]
    //Game is updated
    const updatedGame = updateGame(game)
    if (!updated) {
        socket.emit(error, "Could not update player")
        return;
    }
    if (!updatedGame) {
        socket.emit(error, "Could not update game")
        return;
    }
    //Emits score for this particular round back to player (socketID)
    socket.emit(roundScore, {playerScore})
    
};


