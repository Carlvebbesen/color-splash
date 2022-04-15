"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const disconnectEvent_1 = require("./events/disconnectEvent");
const hostCreateGameEvent_1 = require("./events/hostCreateGameEvent");
const globalEvents_1 = require("./globalEvents");
const joinGameEvent_1 = require("./events/joinGameEvent");
const startGameEvent_1 = require("./events/startGameEvent");
const colorsDisplayedFinishedEvent_1 = require("./events/colorsDisplayedFinishedEvent");
const playerFinishedEvent_1 = require("./events/playerFinishedEvent");
const serverState_1 = require("./serverState");
let lastCommitToMaster = "";
require("child_process").exec("git rev-parse HEAD", function (_, stdout) {
    lastCommitToMaster = stdout;
});
const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);
exports.io = new socket.Server(server, {
    cors: {
        origin: "*",
    },
});
//setup the start connection
//add events here when they are made in the backend
exports.io.on("connection", (socket) => {
    socket.on(globalEvents_1.disconnect, () => (0, disconnectEvent_1.default)(socket, exports.io));
    socket.on(globalEvents_1.hostCreateGame, (data) => (0, hostCreateGameEvent_1.hostCreateGameEvent)(socket, exports.io, data));
    socket.on(globalEvents_1.joinGame, (data) => (0, joinGameEvent_1.joinGameEvent)(socket, exports.io, data));
    socket.on(globalEvents_1.startGame, (data) => (0, startGameEvent_1.startGameEvent)(socket, exports.io, data));
    socket.on(globalEvents_1.colorsDisplayedFinished, (data) => (0, colorsDisplayedFinishedEvent_1.colorsDisplayedFinishedEvent)(socket, exports.io, data));
    socket.on(globalEvents_1.playerFinished, (data) => (0, playerFinishedEvent_1.playerFinishedEvent)(socket, data));
});
app.get("/", (_, res) => {
    const gameStateString = (0, serverState_1.getGameStateAsString)();
    res.send(`<html lang="no">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <!-- Your HTML here -->
    <p>Welcome to an Express server with websockets! port: ${port}. PlayerCount: ${exports.io.engine.clientsCount}. Last commit to master: ${lastCommitToMaster}</p>
    <br/>
    ${gameStateString} <br/>
      </body>
</html>
    `);
});
server.listen(port, () => {
    console.log(`Connected successfully on port ${port}`);
});
//# sourceMappingURL=server.js.map