"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const disconnect = require("./events/disconnect");
const app = express();
const port = 8000;
const server = http.createServer(app);
const io = new socket.Server(server, {
    cors: {
        origin: "*",
    },
});
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.emit("hello", "world");
    socket.on("disconnect", () => disconnect);
    setInterval(() => io.emit("time", new Date().toTimeString()), 1000);
});
app.get("/", (_, res) => {
    res.send(`Welcome to an Express server with websockets!`);
});
server.listen(port, () => {
    console.log(`Connected successfully on port ${port}`);
    console.log(io.listenerCount("connection"));
});
//# sourceMappingURL=server.js.map