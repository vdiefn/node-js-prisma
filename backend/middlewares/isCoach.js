import { prisma } from "../lib/prisma.js";
import errorHandler from "../utils/errorHandler.js";

export const isCoach = async (req, res, next) => {
  const { id } = req.user;

  const coachData = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      role: true,
    },
  });

  if (!coachData || coachData.role === "USER") {
    return next(errorHandler(401, "使用者尚未成為教練"));
  }
  next();
};
