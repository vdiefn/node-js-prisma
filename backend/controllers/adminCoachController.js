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
      userId,
      experienceYears: experience_years,
      description,
      profileImageUrl: profile_image_url,
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
        user_id: coachData.userId,
        experience_years: coachData.experienceYears,
        description: coachData.description,
        profile_image_url: coachData.profileImageUrl,
        created_at: coachData.createdAt,
        updated_at: coachData.updatedAt,
      },
    },
  });
};

export const getAdminCoach = async (req, res, next) => {
  const { id: userId } = req.user;

  const coachData = await prisma.coach.findUnique({
    where: {
      userId,
    },
    include: {
      user: true,
      coachSkill: {
        include: {
          skill: true,
        },
      },
    },
  });
  if (!coachData || coachData.user.role === "USER") {
    return next(errorHandler(401, "使用者尚未成為教練"));
  }

  res.status(200).json({ status: "success", data: coachData });
};
