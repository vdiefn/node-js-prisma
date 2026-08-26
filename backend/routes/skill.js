import express from "express"
import { getCoachSkill, createCoachSkill, deleteCoachSkill } from "../controllers/skillController.js"

const router = express.Router()

router.get("/", getCoachSkill)
router.post("/", createCoachSkill)
router.delete("/:skillId", deleteCoachSkill)

export default router