const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/chat-realtime");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

module.exports = db;
