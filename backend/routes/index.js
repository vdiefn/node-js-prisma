import express from "express";
import skillRouter from "./skill.js";
import healthCheckRouter from "./healthCheck.js";
import creditPackageRouter from "./creditPackage.js";
import userRouter from "./user.js";
import adminCoachRouter from "./adminCoach.js";
import coachRouter from "./coach.js";
import courseRouter from "./course.js";

const router = express.Router();

router.use("/healthCheck", healthCheckRouter);
router.use("/api/coaches/skill", skillRouter);
router.use("/api/credit-package", creditPackageRouter);
router.use("/api/users", userRouter);
router.use("/api/admin/coaches", adminCoachRouter);
router.use("/api/coaches", coachRouter);
router.use("/api/courses", courseRouter);

export default router;
