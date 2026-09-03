import { prisma } from "../lib/prisma.js";
import errorHandler from "../utils/errorHandler.js";

export const getAllCoaches = async (req, res, next) => {
  const { per, page } = req.query;

  const cleanPage = Number(page);
  const cleanPageSize = Number(per);

  if (
    !cleanPage ||
    !cleanPageSize ||
    !Number.isInteger(cleanPage) ||
    !Number.isInteger(cleanPageSize) ||
    cleanPageSize <= 0 ||
    cleanPage <= 0
  ) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const coachData = await prisma.coach.findMany({
    skip: (cleanPage - 1) * cleanPageSize,
    take: cleanPageSize,
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const data = coachData.map((i) => {
    return {
      id: i.id,
      user_id: i.userId,
      name: i.user.name,
    };
  });

  res.status(200).json({
    status: "success",
    data: data,
  });
};
