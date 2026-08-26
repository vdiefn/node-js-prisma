import express from "express";
import skillRouter from "./skill.js";
import healthCheckRouter from "./healthCheck.js";
import creditPackageRouter from "./creditPackage.js";

const router = express.Router();

router.use("/healthCheck", healthCheckRouter);
router.use("/api/coaches/skill", skillRouter);
router.use("/api/credit-package", creditPackageRouter);

export default router;
