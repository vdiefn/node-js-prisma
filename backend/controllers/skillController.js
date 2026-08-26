import { prisma } from "../lib/prisma.js";
import validator from "validator";
import { isValidString } from "../utils/validation.js";
import errorHandler from "../utils/errorHandler.js";

export const getCoachSkill = async (req, res, next) => {
  const skills = await prisma.skill.findMany();

  res.status(200).json({ status: "success", data: skills });
};

export const createCoachSkill = async (req, res, next) => {
  const { name } = req.body;

  if (!isValidString(name)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const hasSkill = await prisma.skill.findUnique({ where: { name } });

  if (hasSkill) {
    return next(errorHandler(409, "資料重複"));
  }

  const newSkill = await prisma.skill.create({
    data: { name },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  res.status(201).json({ status: "success", data: newSkill });
};

export const deleteCoachSkill = async (req, res, next) => {
  const { skillId } = req.params;

  if (!validator.isUUID(skillId)) {
    return next(errorHandler(400, "ID錯誤"));
  }

  const hasSkill = await prisma.skill.findUnique({
    where: { id: skillId.trim() },
  });

  if (!hasSkill) {
    return next(errorHandler(400, "ID錯誤"));
  }

  await prisma.skill.delete({ where: { id: skillId.trim() } });

  res.status(200).json({ status: "success", data: null });
};
