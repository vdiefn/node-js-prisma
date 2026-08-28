import errorHandler from "../utils/errorHandler.js";
import { isValidString, isValidInteger, isValidURL } from "../utils/validation.js";

export const createCoach = async (req, res, next) => {
  const { user_id: userId } = req.params;
  const { experience_years, description, profile_image_url } = req.body;

  if (!isValidString(description) || !isValidInteger(experience_years) || !isValidURL(profile_image_url)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const userData = await prisma.user.findUnique({ where: { id: userId } });
  if (!userData) {
    return next(errorHandler(400, "使用者不存在"));
  }

  if (userData.role === "COACH") {
    return next(errorHandler(409, "使用者已經是教練"));
  }

  const updateUserData = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: "COACH",
    },
    select: {
      name: true,
      role: true,
    },
  });

  const coachData = await prisma.coach.create({
    data: {
      user_id: userId,
      experience_years,
      description,
      profile_image_url,
    },
  });
  res.status(201).json({
    data: {
      user: {
        name: updateUserData.name,
        role: updateUserData.role,
      },
      coach: {
        id: coachData.id,
        user_id: coachData.user_id,
        experience_years: coachData.experience_years,
        description: coachData.description,
        profile_image_url: coachData.profile_image_url,
      },
    },
  });
};
