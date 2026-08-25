import express from "express"
import skillRouter from "./skill.js"
import healthCheckRouter from "./healthCheck.js"

const router = express.Router()

router.use("/healthCheck", healthCheckRouter)
router.use("/api/coaches/skill", skillRouter)



export default router