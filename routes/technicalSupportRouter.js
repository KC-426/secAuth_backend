import express from "express";
import userAuth from "../middleware/auth.js";

import { createTechnicalSupportRequest } from "../controller/technicalSupportController.js";

const router = express.Router();

router
  .route("/add/new/support/request")
  .post(userAuth, createTechnicalSupportRequest);

export default router;
