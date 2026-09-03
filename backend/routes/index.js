import express from "express";
import skillRouter from "./skill.js";
import healthCheckRouter from "./healthCheck.js";
import creditPackageRouter from "./creditPackage.js";
import userRouter from "./user.js";
import adminCoachRouter from "./adminCoach.js";
import coachRouter from "./coach.js";

const router = express.Router();

router.use("/healthCheck", healthCheckRouter);
router.use("/api/coaches/skill", skillRouter);
router.use("/api/credit-package", creditPackageRouter);
router.use("/api/users", userRouter);
router.use("/api/admin/coaches", adminCoachRouter);
router.use("/api/coaches", coachRouter);

export default router;
