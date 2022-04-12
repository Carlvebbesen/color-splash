import { Socket } from "socket.io";
import { calculateScore } from "../utils";
import { error } from "../globalEvents";
import { getGame, getPlayer, updateGame, updatePlayer } from "../serverState";
import { player, playerRound, result } from "../types/internalTypes";

export const playerFinishedEvent = (socket: Socket, roundData: playerRound) => {
    //Gets game from gameID passed in roundData
    const game = getGame(roundData.gameId);
    if (!game) {
        socket.emit(error, "Game could not be found");
    }
    //TODO
    //Get specific player from playerState, and update that player
    //Get specific answer array from correct round from game
    let answers: string[];
    game.rounds.map(round => 
        round.round === roundData.round ? answers = round.colors : console.log("Heisann")
    )
    //calculates score
    const playerScore = calculateScore(roundData.answer, answers, roundData.timeUsed, game.timeEachRound);
    let player: player = getPlayer(roundData.playerId);
    //Now we have to update player
    //Things that need to be updated
    //add a new played round for that particular player
    const playedRound = {...roundData, score: playerScore};
    player = {...player, roundsPlayed: [...player.roundsPlayed, playedRound]}
    const updated = updatePlayer(player)
    const playerResult: result = {
        playerId: player.socketId,
        nickname: player.name,
        score: playerScore
    }
    //Games result array is updated
    game.result = [...game.result, playerResult]
    const updatedGame = updateGame(game)
    if (!updated) {
        socket.emit(error, "Could not update player")
    }
    if (!updatedGame) {
        socket.emit(error, "Could not update game")
    }
    
};


