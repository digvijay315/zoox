const express = require("express");
const { createOrUpdateOrder, getActiveOrder, getActiveVirtualOrders, checkoutOrder, getAllOrders, cancelOrder } = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createOrUpdateOrder);
router.get("/all", protect, getAllOrders);
router.get("/virtual/active", protect, getActiveVirtualOrders);
router.get("/active/:tableId", protect, getActiveOrder);
router.route("/:orderId/checkout").post(protect, checkoutOrder);
router.delete("/:orderId", protect, cancelOrder);

module.exports = router;
