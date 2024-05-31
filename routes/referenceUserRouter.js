import express from "express";
import multer from "multer";
import userAuth from "../middleware/auth.js";

import {
  addReferenceUser,
  getAllReferenceUsers,
  getRefernceUserById,
  removeReferenceUser,
  editReferenceUser,
} from "../controller/referenceUserController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router
  .route("/add/ref/user")
  .post(upload.single("image"), userAuth, addReferenceUser);
router.route("/get/all/reference/users").get(userAuth, getAllReferenceUsers);
router.route("/get/ref/user/:userId").get(userAuth, getRefernceUserById);
router.route("/delete/ref/user/:userId").delete(userAuth, removeReferenceUser);
router
  .route("/update/ref/user/:refUserId")
  .put(upload.single("image"), userAuth, editReferenceUser);

export default router;
