import * as express from "express";
import * as http from "http";
import * as socket from "socket.io";
import * as disconnect from "./events/disconnect";
import { initGame } from "./game/setup";
//import { hostCreateNewGame } from "./events/host_events";
import * as eventTypes from "./types/eventTypes";

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
  eventTypes.ClientToServerEvents,
  eventTypes.ServerToClientEvents,
  eventTypes.InterServerEvents,
  eventTypes.SocketData
>(server, {
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
initGame()
  /**
   * Next one is easy, hostRoomFull.
   * socket.on('hostRoomFull') is called notifying the server that the host room is full,
   * and will block any other attempt from anyone else.
   * ALternatively, this is a server-to-client emit, which is the server telling either
   * the host, or everyone connected, that this room is full.
   */
app.get("/", (_, res) => {
  res.send(
    `Welcome to an Express server with websockets! port: ${port} \n LastCommit hash to branch master: ${lastCommitToMaster}`
  );
});
server.listen(port, (): void => {
  console.log(`Connected successfully on port ${port}`);
  console.log(io.listenerCount("connection"));
});
