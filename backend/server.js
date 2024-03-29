const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { addUser, removeUser, getUser } = require("./utils/user");

const io = new Server(server);

// routes
app.get("/", (req, res) => {
  res.send("This is mern realtime board sharing app official server");
});

let roomIdGlobal, imgURLGlobal;

io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    socket.join(roomId);
    const users = addUser({
      name,
      userId,
      roomId,
      host,
      presenter,
      socketId: socket.id,
    });
    socket.emit("userIsJoined", { success: true, users });
    socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted", name);
    socket.broadcast.to(roomId).emit("allUsers", users);
    socket.broadcast.to(roomId).emit("whiteboardDataResponse", {
      imgURL: imgURLGlobal,
    });
  });

  socket.on("whiteboardData", (data) => {
    imgURLGlobal = data;
    socket.broadcast.to(roomIdGlobal).emit("whiteboardDataResponse", {
      imgURL: data,
    });
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
      console.log(user);
      socket.broadcast
        .to(roomIdGlobal)
        .emit("userLeftMessageBroadcasted", user.name);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on: ${PORT}`);
});
