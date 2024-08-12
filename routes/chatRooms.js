const express = require("express");
const chatController = require("../controllers/chatController");
const router = express.Router();
router.get("/createRoom", chatController.createChatRoom);
router.get("/getRoomById", chatController.getRoomById);
router.get("/endRoom", chatController.endRoom);
router.get("/getAll", chatController.getAllRooms);
router.post("/postMessage", chatController.addMessage);
module.exports = router;
