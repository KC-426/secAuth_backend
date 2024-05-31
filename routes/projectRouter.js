import express from "express";
import userAuth from "../middleware/auth.js";

import {
  addProject,
  editProject,
  getAllProjects,
  getProjectById,
  removeProjectById,
} from "../controller/projectController.js";

const router = express.Router();

router.route("/add/new/project").post(userAuth, addProject);
router.route("/edit/project/:projectId").put(userAuth, editProject);
router.route("/fetch/all/project").get(userAuth, getAllProjects);
router.route("/get/project/:projectId").get(getProjectById);
router.route("/delete/project/:projectId").delete(removeProjectById);

export default router;
