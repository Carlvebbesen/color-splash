import { Socket } from "socket.io";

/**
 * Takes in a gameID and a socketId/playerID.
 * Finds game from gameID, and checks if hostId matches with socketId
 * Then generates a new round, with new randomized colors and 
 * updates the corresponding datastructurs to reflect new round.
 * @param socket - host socket
 * @param gameId - gameId for a particular game
 */
export const nextRoundEvent = (socket: Socket, gameId: string) => {};
