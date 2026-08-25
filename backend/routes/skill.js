import express from "express"
import { getCoachSkill } from "../controllers/skillController.js"

const router = express.Router()

router.get("/", getCoachSkill)

export default router