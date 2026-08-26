import express from "express";
import skillRouter from "./skill.js";
import healthCheckRouter from "./healthCheck.js";
import creditPackageRouter from "./creditPackage.js";
import userRouter from "./user.js";

const router = express.Router();

router.use("/healthCheck", healthCheckRouter);
router.use("/api/coaches/skill", skillRouter);
router.use("/api/credit-package", creditPackageRouter);
router.use("/api/users", userRouter);

export default router;
