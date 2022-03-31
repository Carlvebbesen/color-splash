import * as express from "express";
import * as http from "http";
import * as socket from "socket.io";
import disconnectEvent from "./events/disconnectEvent";
import { hostCreateGameEvent } from "./events/hostCreateGameEvent";
import { disconnect, hostCreateGame, joinGame } from "./globalEvents";
import { InterServerEvents } from "./types/interServerTypes";
import { ServerToClientEvents } from "./types/serverToClientTypes";
import { ClientToServerEvents } from "./types/clientToServerTypes";
import { joinGameEvent } from "./events/joinGameEvent";
import { createGame, playerJoinGame } from "./types/socketDataTypes";

let lastCommitToMaster = "";
require("child_process").exec(
  "git rev-parse HEAD",
  function (_: Error, stdout: string) {
    lastCommitToMaster = stdout;
  }
);
const app: express.Application = express();
const port = process.env.PORT || 8000;
const server: http.Server = http.createServer(app);
export const io = new socket.Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
>(server, {
  cors: {
    origin: "*",
  },
});
//setup the start connection
//add events here when the are made in the backend
io.on("connection", (socket: socket.Socket) => {
  socket.on(disconnect, () => disconnectEvent(socket, io));
  socket.on(hostCreateGame, (data: createGame) =>
    hostCreateGameEvent(socket, io, data)
  );
  socket.on(joinGame, (data: playerJoinGame) =>
    joinGameEvent(socket, io, data)
  );
});


app.get("/", (_, res) => {
  res.send(
    `Welcome to an Express server with websockets! port: ${port}. PlayerCount: ${io.engine.clientsCount}. Last commit to master: ${lastCommitToMaster}`
  );
});
server.listen(port, (): void => {
  console.log(`Connected successfully on port ${port}`);
});
