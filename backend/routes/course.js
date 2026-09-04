import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getAllCourses, bookingCourse } from "../controllers/courseController.js";

const router = Router();

router.get("/", getAllCourses);
router.post("/:courseId", verifyToken, bookingCourse);

export default router;
