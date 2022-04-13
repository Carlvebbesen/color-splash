import { endGame } from "globalEvents";
import { error } from "globalEvents";
import { deleteGame } from "serverState";
import { getGame } from "serverState";
import { Server, Socket } from "socket.io";
import { game } from "../types/internalTypes";

/**
 * Host sends game finished to server.
 * Backend checks that games hostId matches with socketId.
 * Then emits to everyone the endgame event, which frontend listens to
 * and sends every client (including host) back to start page and deletes 
 * game corresponding to that id.
 * @param socket - socketId of host
 * @param gameId - id of game that is to be finished
 */
export const endGameEvent = (socket: Socket, io: Server, gameId: number) => {
    //retrieves game from gamestate
    const game: game = getGame(gameId);
    if (!game) {socket.emit(error, "game does not exists")}
    if (socket.id !== game.hostId) {socket.emit(error, "You are not the host")}
    //Emit to everyone in room that you should return to startPage
    io.in(gameId.toString()).emit(endGame, "Game has ended!");
    //Then, we delete game from gamestate
    deleteGame(gameId);
};
