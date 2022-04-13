import { Socket, Server } from "socket.io";
import { error, gameFinished } from "../globalEvents";
import { deleteGame, getGame } from "../serverState";
import { game } from "../types/internalTypes";

/**
 * When NextRound sees that all rounds have been played, this method
 * is called, and a result page should trigger in frontend.
 * Server emits results to everyone in game based on gameId.
 * @param socket - socketId
 * @param - gameId of game that results is to be displayed
 */
export const gameFinishedEvent = (socket: Socket, io: Server,  gameId: number) => {
    //retrieves game to be finished
    const game: game = getGame(gameId);
    if (!game) {socket.emit(error, "game could not be found")}
    //Sends result array to everyone in room
    io.in(gameId.toString()).emit(gameFinished, game.result)
    //TODO something with player array or answers?
    //Could also emit to every player their answers
};
