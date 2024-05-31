import express from "express";

const router = express.Router();

import {
  addPlan,
  updatePlan,
} from "../controller/subscriptionPlanController.js";

router.route("/add/plan/:userId").post(addPlan);
router.route("/changePlan/:userId/:planId").put(updatePlan);

export default router;
