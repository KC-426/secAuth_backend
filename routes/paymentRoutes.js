import express from "express";

const router = express.Router();

import { paymentDone } from "../controller/paymentController.js";
import userAuth from "../middleware/auth.js";

router.post("/payment/done", userAuth, paymentDone);

export default router;
