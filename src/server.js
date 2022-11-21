import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

const room = {};

wsServer.on("connection", (socket) => {
  const socketID = socket.id;

  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    if (!room[roomName]) room[roomName] = [socketID];
    else room[roomName].push(socketID);

    socket.to(roomName).emit("welcome", socketID);
  });
  socket.on("offer", (offer, targetSocketID) => {
    socket.to(targetSocketID).emit("offer", offer, socketID);
  });
  socket.on("answer", (answer, targetSocketID) => {
    socket.to(targetSocketID).emit("answer", answer, socketID);
  });
  socket.on("ice", (ice, targetSocketID) => {
    socket.to(targetSocketID).emit("ice", ice, socketID);
  });

  socket.on("disconnect", () => {
    const targetRoomName = Object.keys(room).find((key) => room[key].includes(socketID));
    room[targetRoomName] = room[targetRoomName].filter((userSocketID) => userSocketID !== socketID);
    socket.to(targetRoomName).emit("leave", socketID);
    console.log("disconnect!", targetRoomName, socketID);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3003`);
httpServer.listen(3003, handleListen);
