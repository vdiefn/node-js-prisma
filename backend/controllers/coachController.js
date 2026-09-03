import { prisma } from "../lib/prisma.js";
import validator from "validator";
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

export const getCoachDetail = async (req, res, next) => {
  const { coachId } = req.params;

  if (!validator.isUUID(coachId)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const targetCoach = await prisma.coach.findUnique({
    where: {
      id: coachId,
    },
    select: {
      id: true,
      userId: true,
      experienceYears: true,
      description: true,
      profileImageUrl: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          role: true,
        },
      },
      coachSkill: {
        select: {
          skill: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!targetCoach) {
    return next(errorHandler(400, "找不到該教練"));
  }

  const data = {
    user: {
      name: targetCoach.user.name,
      role: targetCoach.user.role,
    },
    coach: {
      id: targetCoach.id,
      user_id: targetCoach.userId,
      experience_years: targetCoach.experienceYears,
      description: targetCoach.description,
      profile_image_url: targetCoach.profileImageUrl,
      created_at: targetCoach.created_at,
      updated_at: targetCoach.updated_at,
      skills: targetCoach.coachSkill.map((item) => item.skill.name),
    },
  };

  res.status(200).json({ status: "success", data });
};

export const getCoachCourse = async (req, res, next) => {
  const { coachId } = req.params;

  if (!validator.isUUID(coachId)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const targetCoach = await prisma.coach.findUnique({
    where: { id: coachId },
    select: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!targetCoach) {
    return next(errorHandler(400, "找不到該教練"));
  }

  const courses = await prisma.course.findMany({
    where: {
      coach: { id: coachId },
      endAt: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      startAt: true,
      endAt: true,
      maxParticipants: true,
      skill: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      startAt: "asc",
    },
  });

  const data = courses.map((c) => {
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      start_at: c.startAt,
      end_at: c.endAt,
      max_participants: c.maxParticipants,
      coach_name: targetCoach.user.name,
      skill_name: c.skill.name,
    };
  });

  res.status(200).json({
    status: "success",
    data,
  });
};
