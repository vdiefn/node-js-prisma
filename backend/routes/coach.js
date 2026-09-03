import { Router } from "express";
import { getAllCoaches } from "../controllers/coachController.js";

const router = Router();

router.get("/", getAllCoaches);

export default router;
