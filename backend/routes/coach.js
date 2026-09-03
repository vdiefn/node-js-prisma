import { Router } from "express";
import { getAllCoaches, getCoachDetail, getCoachCourse } from "../controllers/coachController.js";

const router = Router();

router.get("/:coachId/courses", getCoachCourse);
router.get("/:coachId", getCoachDetail);
router.get("/", getAllCoaches);

export default router;
