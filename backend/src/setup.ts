/**
 * Game main datastructure
 * A map<string, [Player]>, where each gameID has an array of players
 * To emit an event to each player, simply call socket.to(playerSocketID).emit("something")
 * and send the data for each round to the player.
 * For each round finished, the server sends an event to each player that the round has
 * ended. Then data for how each player did is either sent to everyone, or
 * is individually emitted to each player.
 *
 */

// const playerAnswer = () => {};
