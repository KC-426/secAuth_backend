import express from "express";

const router = express.Router();

import { paymentDone } from "../controller/paymentController.js";

router.post("/payment/done", paymentDone);

export default router;
