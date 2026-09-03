import { prisma } from "../lib/prisma.js";
import errorHandler from "../utils/errorHandler.js";
import { getCourseStatus } from "../utils/getCourseStatus.js";
import validator from "validator";
import { isValidString, isValidInteger, isValidURL, isValidArray } from "../utils/validation.js";

export const createCoach = async (req, res, next) => {
  const { userId } = req.params;
  const { experience_years, description, profile_image_url } = req.body;

  if (profile_image_url && !isValidURL(profile_image_url)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  if (!isValidString(description) || !isValidInteger(experience_years)) {
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
    status: "success",
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
    select: {
      id: true,
      experienceYears: true,
      description: true,
      profileImageUrl: true,
      user: {
        select: {
          role: true,
        },
      },
      coachSkill: {
        select: {
          skillId: true,
        },
      },
    },
  });

  const data = {
    id: coachData.id,
    experience_years: coachData.experienceYears,
    description: coachData.description,
    profile_image_url: coachData.profileImageUrl,
    skill_ids: coachData.coachSkill.map((i) => i.skillId),
  };

  res.status(200).json({ status: "success", data });
};

export const updateAdminCoach = async (req, res, next) => {
  const { id: userId } = req.user;
  const { experience_years, description, profile_image_url, skill_ids } = req.body;

  if (
    !isValidInteger(experience_years) ||
    !isValidString(description) ||
    !isValidURL(profile_image_url) ||
    !isValidArray(skill_ids) ||
    !skill_ids.every((i) => validator.isUUID(i))
  ) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const [coachData] = await prisma.$transaction([
    prisma.coach.update({
      where: { userId },
      data: {
        experienceYears: experience_years,
        description,
        profileImageUrl: profile_image_url,
      },
    }),
    prisma.coachSkill.deleteMany({
      where: {
        coach: {
          userId,
        },
      },
    }),
  ]);

  await prisma.coachSkill.createMany({
    data: skill_ids.map((i) => {
      return {
        coachId: coachData.id,
        skillId: i,
      };
    }),
  });

  res.status(200).json({
    status: "success",
    data: {
      experience_years: coachData.experienceYears,
      description,
      profile_image_url: coachData.profileImageUrl,
      skill_ids,
    },
  });
};

export const getCoachCourse = async (req, res, next) => {
  const userId = req.user.id;
  const courses = await prisma.course.findMany({
    where: {
      coach: { userId },
    },
  });

  const courseData = courses.map((item) => {
    return {
      ...item,
      status: getCourseStatus(item.startAt, item.endAt),
    };
  });

  res.status(200).json({ status: "success", data: courseData });
};

export const createCoachCourse = async (req, res, next) => {
  const userId = req.user.id;
  const {
    skill_id: skillId,
    name,
    description,
    start_at: startAt,
    end_at: endAt,
    max_participants: maxParticipants,
    meeting_url: meetingUrl,
  } = req.body;

  if (
    !validator.isUUID(skillId) ||
    !isValidString(name) ||
    !isValidString(description) ||
    !validator.isISO8601(startAt) ||
    !validator.isISO8601(endAt) ||
    !isValidInteger(maxParticipants) ||
    !isValidURL(meetingUrl)
  ) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const courseData = await prisma.course.create({
    data: {
      coach: { connect: { userId } },
      skill: { connect: { id: skillId } },
      name,
      description,
      startAt: startAt,
      endAt: endAt,
      maxParticipants: maxParticipants,
      meetingUrl: meetingUrl,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      course: courseData,
    },
  });
};

export const getCourseDetail = async (req, res, next) => {
  const { courseId } = req.params;
  const { id: userId } = req.user;

  if (!validator.isUUID(courseId)) {
    return next(errorHandler(400, "課程不存在"));
  }

  const target = await prisma.course.findFirst({
    where: {
      id: courseId,
      coach: { userId },
    },
    include: {
      skill: true,
    },
  });

  if (!target) {
    return next(errorHandler(400, "課程不存在"));
  }

  res.status(200).json({
    status: "success",
    data: {
      id: target.id,
      name: target.name,
      description: target.description,
      start_at: target.startAt,
      end_at: target.endAt,
      max_participants: target.maxParticipants,
      skill_name: target.skill.name,
      skill_id: target.skillId,
      meeting_url: target.meetingUrl,
    },
  });
};
