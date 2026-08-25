import { prisma } from "../lib/prisma.js"
import errorHander from "../utils/errorHandler.js"

export const getCoachSkill = async(req, res, next) => {
  const skills = await prisma.skill.findMany()

  res.status(200).json({ status:"success", data: skills })
}
