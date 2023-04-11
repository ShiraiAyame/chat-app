const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://chat-app-mdwt.vercel.app"],
    },
});


const PORT = 5000;

io.on("connection", (socket) => {
    console.log('user connected');

    socket.on("send_message", (data) => {
        console.log(data);

        io.emit("received_message", data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => console.log(`server is running on ${PORT}`));