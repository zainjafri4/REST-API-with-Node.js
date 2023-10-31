const express = require("express");
const router = express.Router();
const Auth = require('../middleWares/auth');
const orderController = require("../controllers/orders")

router.get("/", Auth, orderController.orders_get_all)

router.post("/", Auth, orderController.create_order)

router.get("/:orderId", Auth, orderController.get_order)

router.delete("/:orderId", Auth, orderController.delete_order)

module.exports = router;
