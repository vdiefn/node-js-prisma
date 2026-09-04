import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  signUp,
  login,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  getPurchaseDetail,
  getUserCourse,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);
router.put("/password", verifyToken, updateUserPassword);
router.get("/credit-package", verifyToken, getPurchaseDetail);
router.get("/courses", verifyToken, getUserCourse);

export default router;
