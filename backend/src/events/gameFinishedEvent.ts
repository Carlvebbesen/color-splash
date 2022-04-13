import { Socket } from "socket.io";

/**
 * Server emits results to everyone in game based on gameId.
 * Deletes game from gamestate.
 * @param socket - socketId
 * @param - gameId of game that results is to be displayed
 */
export const gameFinishedEvent = (socket: Socket, gameId: string) => {};
