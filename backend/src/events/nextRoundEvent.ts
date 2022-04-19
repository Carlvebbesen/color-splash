import { endGame, gameFinished } from "../globalEvents";
import { error } from "../globalEvents";
import { Server, Socket } from "socket.io";
import { game } from "../types/internalTypes";
import { gameFinishedEvent } from "./gameFinishedEvent";
import { getGame, getPlayer, updateGame, updatePlayer } from "../serverState";
import { player, playerRound, result } from "../types/internalTypes";
import { generateColors } from "../utils";
import { onlyGameId } from "../types/socketDataTypes";


/**
 * Takes in a gameID and a socketId/playerID.
 * Finds game from gameID, and checks if hostId matches with socketId
 * Then generates a new round, with new randomized colors and 
 * updates the corresponding datastructurs to reflect new round.
 * 
 * @param socket - host socket
 * @param gameId - gameId for a particular game
 */
export const nextRoundEvent = (
    socket: Socket,  
    io: Server, 
    data: onlyGameId
    ) => {
        
    const game = getGame(data.gameId);

    if (!game) {
        socket.emit(error, "Game does not exists") 
    }

    if (socket.id !== game.hostId) {
        socket.emit(error, "You are not the host")
    }

    //Checks if max rounds is reached,
    if (game.rounds.length == game.maxRound) {
        io.in(game.gameId.toString()).emit(gameFinished, {
            gameId: game.gameId,
            nicknames: game.players,
            results: game.result,
            maxRounds: game.maxRound,
        });
    }

    //adds new colors to the next round
    else {
        const newroundColors = generateColors(game.difficulty);
        game.rounds.push({
          round: game.rounds.length + 1,
          gameId: data.gameId,
          colors: newroundColors,
        });
    }

};
