import express from "express";

const router = express.Router();

import {
  paymentOrder,
  updatePaymentOrder,
} from "../controller/OrderController.js";
import userAuth from "../middleware/auth.js";

router.route("/payment/order/:userId/:planId").post(userAuth, paymentOrder);
router.route("/update/order/:userId/:planId").put(userAuth, updatePaymentOrder);

export default router;
