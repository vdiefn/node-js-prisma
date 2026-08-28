import { Router } from "express";
import { createCoach } from "../controllers/adminCoachController.js";
const router = Router();

router.post("/:user_id", createCoach);

export default router;
