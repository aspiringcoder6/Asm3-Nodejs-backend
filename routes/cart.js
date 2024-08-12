const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
router.post("/addToCart", cartController.addCart);
router.post("/deleteItem", cartController.deleteItem);
router.get("/getCart", cartController.getCart);
router.post("/updateCount", cartController.updateCount);
module.exports = router;
