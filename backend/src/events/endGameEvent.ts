import { Socket } from "socket.io";

/**
 * Host sends game finished to server.
 * Backend checks that games hostId matches with socketId
 * @param socket - socketId of host
 * @param gameId - id of game that is to be finished
 */
export const endGameEvent = (socket: Socket, gameId: string) => {};
