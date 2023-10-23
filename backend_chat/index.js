const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./config/config");
const port = 8081;

const routes = require("./routes/index");

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(routes());

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

let users = [];
io.on("connection", (socket) => {
  socket.on("join", (room) => {
    console.log("join: " + room);
    socket.join(room + "");
  });

  socket.on("data_users_online", ({ _id, username }) => {
    const findByData = users.find((item) => item.username == username) || null;
    const index_data_offline = users.map((e) => e.status).indexOf("Offline");

    if (findByData == null || Object.values(findByData) == "") {
      users.push({
        socket_id: socket.id,
        username,
        _id,
        status: "Online",
      });
    }

    if (users[index_data_offline]) {
      users[index_data_offline].status = "Online";
    }

    io.emit("data_users", users);
  });

  socket.on("message", ({ message, room, username, user_id }) => {
    console.log("send message", message, room, username, user_id);
    console.log("room", socket.rooms);
    io.to(room + "").emit("message", { message, username, user_id });
  });

  socket.on("disconnect", (reason) => {
    console.log("disconnect", reason);

    users = users.filter((item) => item.socket_id != socket.id);

    io.emit("data_users", users);
  });

  socket.on("data_users_offline", () => {
    if (users.length > 0) {
      users = users.filter((item) => item.socket_id != socket.id);
    }

    io.emit("data_users", users);
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
