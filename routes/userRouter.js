import express from "express";
import multer from "multer";

import {
  registerUser,
  userLogin,
  getAllUsers,
  getAllUsersCount,
  getUserById,
  removeUser,
  userProfile,
} from "../controller/userController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.route("/register/new/user").post(registerUser);
router.route("/login/user").get(userLogin);
router.route("/get/all/users").get(getAllUsers);
router.route("/get/user/:userId").get(getUserById);
router.route("/get/all/users/count").get(getAllUsersCount);
router.route("/delete/user/:userId").delete(removeUser);
router
  .route("/complete/user/profile/:userId")
  .put(upload.single("image"), userProfile);

export default router;
