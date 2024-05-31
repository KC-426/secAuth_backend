import express from "express";
import userAuth from "../middleware/auth.js";

import {
  createServiceRequest,
  fetchServiceRequest,
} from "../controller/serviceRequestController.js";

const router = express.Router();

router.route("/add/new/request").post(userAuth, createServiceRequest);
router.route("/fetch/all/requests").get(userAuth, fetchServiceRequest);

export default router;
