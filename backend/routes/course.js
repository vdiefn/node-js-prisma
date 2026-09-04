import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getAllCourses, bookingCourse, cancelBookingCourse } from "../controllers/courseController.js";

const router = Router();

router.get("/", getAllCourses);
router.post("/:courseId", verifyToken, bookingCourse);
router.delete("/:courseId", verifyToken, cancelBookingCourse);

export default router;
