const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  cashfreeOrderController,
  getOrderStatusCashfreeController,
} = require("../controller/cashfreeOrderController");

const router = express.Router();

router.post("/payments/create_order", authMiddleware, cashfreeOrderController);

router.get(
  "/payments/:orderId",
  authMiddleware,
  getOrderStatusCashfreeController,
);

module.exports = router;
