import { Router } from "express";
import { createCoach, getAdminCoach, updateAdminCoach } from "../controllers/adminCoachController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isCoach } from "../middlewares/isCoach.js";
const router = Router();

router.post("/:userId", createCoach);
router.get("/", verifyToken, isCoach, getAdminCoach);
router.put("/", verifyToken, isCoach, updateAdminCoach);

export default router;
