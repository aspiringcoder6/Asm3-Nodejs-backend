const ChatRoom = require("../model/Chat");
const io = require("../socket").getIo();
//Tra ve room cho nguoi dung
exports.getRoomById = async (req, res, next) => {
  const roomId = req.query.id;
  try {
    const chatRoom = await ChatRoom.findById(roomId);
    return res.json({ content: chatRoom.messages });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.createChatRoom = async (req, res, next) => {
  try {
    const newChat = new ChatRoom({
      messages: [],
    });
    await newChat.save();
    return res.status(200).json({ roomId: newChat._id });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.addMessage = async (req, res, next) => {
  const { message, roomId, isAdmin } = req.body;
  try {
    const updatedRoom = await ChatRoom.findById(roomId);
    const updatedMessages = [
      ...updatedRoom.messages,
      {
        message,
        isAdmin,
      },
    ];
    updatedRoom.messages = updatedMessages;
    await updatedRoom.save();
    io.to(roomId).emit("chatMessage");
    return res.status(200).json({ message: "Message added successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.getAllRooms = async (req, res, next) => {
  try {
    const allRooms = await ChatRoom.find();
    return res.status(200).json({ rooms: allRooms });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.endRoom = (req, res, next) => {
  const roomId = req.query.id;
  ChatRoom.deleteOne({ _id: roomId })
    .then(() => {
      io.to(roomId).emit("endRoom");
      return res.status(200).json({ message: "End room successful" });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Internal server error" });
    });
};
