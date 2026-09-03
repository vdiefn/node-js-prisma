import { prisma } from "../lib/prisma.js";
import errorHandler from "../utils/errorHandler.js";

export const getAllCourses = async (req, res, next) => {
  const today = new Date();
  const courses = await prisma.course.findMany({
    where: {
      startAt: {
        lte: today,
      },
      endAt: {
        gt: today,
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      startAt: true,
      endAt: true,
      maxParticipants: true,
      coach: {
        select: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      skill: {
        select: {
          name: true,
        },
      },
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
      coach_name: c.coach.user.name,
      skill_name: c.skill.name,
    };
  });
  res.status(200).json({
    status: "success",
    data,
  });
};
