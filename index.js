const express = require("express");
const cors = require("cors");
let dotenv = require("dotenv").config();
let database = require("./config/database");
let app = new express();
let router = require("./routes/userRoute");
let messageRoute = require("./routes/messagesRoute");
let socket = require("socket.io");

database();

app.use(cors());
app.use(express.json());
app.use("/api/auth", router);
app.use("/api/messages", messageRoute);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`server connected to port ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("mesg-recieve", data.message);
    }
  });
});
