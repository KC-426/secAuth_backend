import express from "express";

const router = express.Router();

import {
  paymentOrder,
  updatePaymentOrder,
} from "../controller/OrderController.js";

router.route("/payment/order/:userId/:planId").post(paymentOrder);
router.route("/update/order/:userId/:planId").put(updatePaymentOrder);

export default router;
