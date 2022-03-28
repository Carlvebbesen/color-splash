import { Player } from "player";
import { io } from "../server"

let sock;

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

const gameData = new Map<string, [Player]>()

export const initGame = () => {

    io.on('connection', socket => {
        
        sock = socket;
        //Host events
        sock.on('hostCreateNewGame', hostCreateNewGame)
        sock.on('hostRoomFull', hostRoomFull)
        sock.on('hostCountDownFinished', hostCountDownFinished)
        sock.on('hostNextRound', hostNextRound)
        sock.on('hostGameOver', hostGameOver)

        //Player events
        sock.on('playerJoinGame', playerJoinGame)
        sock.on('playerAnswer', playerAnswer)
        /* socket.on('', playerAnswer)
        socket.on('playerAnswer', playerAnswer) */

        //Server events to all players
    })

}

const hostCreateNewGame = (/* Her må vi passe inn et playerobjekt!*/) => {
    const gameID = (Math.random() * 100000) | 0;
    console.log(gameID)
    sock.emit("newGameCreated", { gameID: gameID, mySocketId: sock.id });
    const host: Player = {
        gameID: gameID.toString(),
        name: "",
        socketID: sock.id,
        round: 0,
        answer: ""
    }
    sock.join(gameID.toString())
    gameData[gameID] = [host] //Legger til gameID og pusher hosten som first player
    console.log("created game");
    console.log(`Dette er id til det nylig skapte game-room ${gameID}`)
}

const hostRoomFull = () => {

}

const hostCountDownFinished = () => {

}

const hostNextRound = () => {

}

const hostGameOver = () => {

}

/**
 * Method for player to join game
 * @param player Player object sent as json argument from client
 */
const playerJoinGame = (player: Player) => {
    console.log(`Tries to join game with id ${player.gameID}`);
    sock.join(player.gameID);
    sock.to(player.gameID).emit(`playerJoinedRoom`, 
                          `Player with ${player.socketID} joined room with 
                          id ${player.gameID}`)
    console.log(sock.rooms)
    gameData[player.gameID].push(player)
    console.log(gameData[player.gameID])
}

const playerAnswer = () => {

}