import { Router } from "express";
import { createCoach, getAdminCoach } from "../controllers/adminCoachController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = Router();

router.post("/:userId", createCoach);
router.get("/", verifyToken, getAdminCoach);

export default router;
