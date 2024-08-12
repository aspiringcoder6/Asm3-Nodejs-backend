const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
router.post("/postOrder", orderController.placeOrder);
router.get("/getOrders", orderController.getUserHistory);
router.get("/getOrder", orderController.getOrderById);
router.get("/getAdminOrders", orderController.getHistory);
module.exports = router;
