import { Router } from "express";
import {
  createCoach,
  getAdminCoach,
  updateAdminCoach,
  getCoachCourse,
  createCoachCourse,
  getCourseDetail
} from "../controllers/adminCoachController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isCoach } from "../middlewares/isCoach.js";
const router = Router();

router.post("/courses", verifyToken, isCoach, createCoachCourse);
router.post("/:userId", createCoach);
router.get("/courses/:courseId", verifyToken, isCoach, getCourseDetail)
router.get("/courses", verifyToken, isCoach, getCoachCourse);
router.get("/", verifyToken, isCoach, getAdminCoach);
router.put("/", verifyToken, isCoach, updateAdminCoach);

export default router;
