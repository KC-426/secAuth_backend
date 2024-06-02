import express from "express";

const router = express.Router();

import {
  addPlan,
  updatePlan,
} from "../controller/subscriptionPlanController.js";
import userAuth from "../middleware/auth.js";

router.route("/add/plan/:userId").post(userAuth, addPlan);
router.route("/changePlan/:userId/:planId").put(userAuth, updatePlan);

export default router;
