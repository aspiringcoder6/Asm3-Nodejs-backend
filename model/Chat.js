const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messageSchema = new Schema({
  isAdmin: {
    type: Boolean,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
const chatRoomSchema = new Schema({
  messages: [messageSchema],
});
module.exports = mongoose.model("ChatRoom", chatRoomSchema);
