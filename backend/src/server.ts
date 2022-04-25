import * as express from "express";
import * as http from "http";
import * as socket from "socket.io";
import disconnectEvent from "./events/disconnectEvent";
import { hostCreateGameEvent } from "./events/hostCreateGameEvent";
import {
  colorsDisplayedFinished,
  disconnect,
  endGame,
  hostCreateGame,
  joinGame,
  leaveGame,
  nextRound,
  playerFinished,
  startGame,
} from "./globalEvents";
import { ServerToClientEvents } from "./types/serverToClientTypes";
import { ClientToServerEvents } from "./types/clientToServerTypes";
import { joinGameEvent } from "./events/joinGameEvent";
import {
  createGameData,
  gameIdNickname,
  onlyGameId,
  playerAnswerGameId,
} from "./types/socketDataTypes";
import { startGameEvent } from "./events/startGameEvent";
import { colorsDisplayedFinishedEvent } from "./events/colorsDisplayedFinishedEvent";
import { playerFinishedEvent } from "./events/playerFinishedEvent";
import { getGameStateAsString } from "./serverState/gameState";
import { getPlayerAsString } from "./serverState/playerState";
import { nextRoundEvent } from "./events/nextRoundEvent";
import { endGameEvent } from "./events/endGameEvent";
import { leaveGameEvent } from "./events/leaveGameEvent";

const app: express.Application = express();
const port = process.env.PORT || 8000;
const server: http.Server = http.createServer(app);
export const io = new socket.Server<ClientToServerEvents, ServerToClientEvents>(
  server,
  {
    cors: {
      origin: "*",
    },
  }
);
//setup the start connection
//add events here when they are made in the backend
io.on("connection", (socket: socket.Socket) => {
  socket.on(disconnect, () => disconnectEvent(socket, io));
  socket.on(hostCreateGame, (data: createGameData) =>
    hostCreateGameEvent(socket, io, data)
  );
  socket.on(joinGame, (data: gameIdNickname) =>
    joinGameEvent(socket, io, data)
  );
  socket.on(startGame, (data: onlyGameId) => startGameEvent(socket, io, data));
  socket.on(colorsDisplayedFinished, (data: onlyGameId) =>
    colorsDisplayedFinishedEvent(socket, io, data)
  );
  socket.on(playerFinished, (data: playerAnswerGameId) =>
    playerFinishedEvent(socket, data)
  );
  socket.on(nextRound, (data: onlyGameId) => nextRoundEvent(socket, io, data));
  socket.on(endGame, (data: onlyGameId) => endGameEvent(socket, io, data));
  socket.on(leaveGame, (data: onlyGameId) => leaveGameEvent(io, socket, data));
});
app.get("/download-apk", (_, res) => {
  const file = "./src/downloadGame/colorSplash.apk";
  res.download(file);
  res.status(200);
});
app.get("/", (_, res) => {
  const gameStateString = getGameStateAsString();
  const playerStateString = getPlayerAsString();
  res.send(
    `
    <!DOCTYPE html>
    <head><meta name="viewport" content="initial-scale=1, maximum-scale=1">
    </head>
    <html lang="no">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
  <!-- Your HTML here -->
  <h2>Welcome to the Color Splash server!</h2><p> This is an Express server built with websockets using socket.IO! View the code for this server <a href="https://github.com/Carlvebbesen/color-splash">here</a> and view the frontend code <a href="https://github.com/FabianFoss/color-splash-frontend">here</a><br/><br/>Port: ${port}<br/>Players connected: ${io.engine.clientsCount}</p>
  <h2> Download the game for android <a href="https://color-splash.herokuapp.com/download-apk" download="ColorSplash.apk">here</a> </h2>
  <img height="300" style="margin-right:1cm" src="https://camo.githubusercontent.com/019da4ff0a5764bd8f813a55594497af1075a8519a9ec004798c4cb9d5428428/68747470733a2f2f696d6775722e636f6d2f6c716c6e5a4e4a2e706e67" alt="Color-splash-game"><img height="300" src="https://camo.githubusercontent.com/24c36dc95c76e89cfab69077d5963586f132be9483ce839b547b99517b05ef00/68747470733a2f2f696d6775722e636f6d2f306f7339626c652e706e67" alt="Color-splash-ingame">
  <br/>
  <br/>
  The current state of the game is:<br/>
  <br/>
  ${gameStateString} <br/>
  <br/>
  ${playerStateString} <br/>
  </body>
</html>
    `
  );
});
server.listen(port, (): void => {
  console.log(`Connected successfully on port ${port}`);
});
