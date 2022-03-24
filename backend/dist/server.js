"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const disconnect = require("./events/disconnect");
const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);
exports.io = new socket.Server(server, {
    cors: {
        origin: "*",
    },
});
/**
 * Workflow tips and tricks
 * When in doubt, use any;)
 * Dividing shit up into files and modules is nonessential at first,
 * implement methods closest to the shit you`re working with,
 * and after a while, whenever it is possible, abstract away into
 * modules with functions.
 * console log every fucking thing, especially when things become undefined
 * Remember, most guides are for implementing a single room, when we
 * have to use multiple game rooms;) although the simplest thing is to
 * follow a guide for one room, and when that works, simply scale up by
 * adding an array of rooms and loop through with a for-each loop
 *
 * KEY reading - learn how to pass objects as arguments in a socket.io request!!
 */
exports.io.on("connection", (socket) => {
    console.log("a user connected");
    socket.emit("hello", "world");
    socket.on("disconnect", () => disconnect);
    socket.on("hostCreateNewGame", () => {
        const gameID = (Math.random() * 100000) | 0;
        socket.emit("newGameCreated", { gameID: gameID, mySocketId: socket.id });
        socket.join(gameID.toString()); /*this should work, joins a room
        where the set consists of
        Set<string> {asdadadwaxadcdt (some random ass socket id string), 56741 - string id of room}
        string id of room is vital, and needs to be emited back to client.
        */
        console.log("Tried to create game");
        console.log(gameID);
        console.log(socket.rooms);
    });
    socket.on("playerJoinGame", (gameID, name) => {
        console.log(`Tries to join game with id ${gameID}`);
        /* The problem here, is that as of now we are
        unable to find the room with the game id in room set
        because of fucking typescript. Something to do with any
        indexing. Look up how to use rooms[gameID] for a socketIO
        Set<string>. Now, after this, we need to check if socket.join(gameID) works,
        which it should.
        In order to test this, have two connections open on a local postman client
        NB!! Download desktop postman, because remote does not have access to localhost
        One connection calls hostCreateNewGame, and that logs a key like 56743 (copy this).
        Another connection, calls the event playerJoinGame, and with a parameter gameID (for now),
        add later stuff later.
        Then, console log socket.rooms and verify that the room with a key 57564 whatever (same as abpve)
        has two long boi socket-id strings attached to it. Otherwise read the documentation
        to find out where the fuck our socket id went.
        */
        if (socket.rooms.has(gameID)) {
            console.log(`Found room with key ${gameID}`);
        }
        socket.join(gameID);
        socket.in(gameID).emit("playerJoinedRoom", gameID, name);
        console.log(socket.rooms);
    });
    /**
     * Next one is easy, hostRoomFull.
     * socket.on('hostRoomFull') is called notifying the server that the host room is full,
     * and will block any other attempt from anyone else.
     * ALternatively, this is a server-to-client emit, which is the server telling either
     * the host, or everyone connected, that this room is full.
     */
    setInterval(() => exports.io.emit("time", new Date().toTimeString()), 1000);
});
app.get("/", (_, res) => {
    res.send(`Welcome to an Express server with websockets! port: ${port} kjøør!`);
});
server.listen(port, () => {
    console.log(`Connected successfully on port ${port}`);
    console.log(exports.io.listenerCount("connection"));
});
//# sourceMappingURL=server.js.map