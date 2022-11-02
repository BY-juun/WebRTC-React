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

wsServer.on("connection", (socket) => {
  const socketID = socket.id;
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome", socketID);
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer, socketID);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer, socketID);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice, socketID);
  });
  socket.on("leave_room", (roomName) => {
    socket.leave(roomName);
    console.log("leave");
    socket.to(roomName).emit("leave", socketID);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
