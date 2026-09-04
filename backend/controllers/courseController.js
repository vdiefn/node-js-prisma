import { prisma } from "../lib/prisma.js";
import errorHandler from "../utils/errorHandler.js";
import validator from "validator";

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

export const bookingCourse = async (req, res, next) => {
  const { courseId } = req.params;
  const { id: userId } = req.user;

  if (!validator.isUUID(courseId)) {
    return next(errorHandler(400, "ID錯誤"));
  }

  const targetCourse = await prisma.course.findUnique({ where: { id: courseId } });
  if (!targetCourse) {
    return next(errorHandler(400, "ID錯誤"));
  }

  const hasBooked = await prisma.courseBooking.findFirst({
    where: {
      userId,
      courseId,
    },
  });
  if (hasBooked) {
    return next(errorHandler(400, "已經報名過此課程"));
  }

  const creditPurchaseData = await prisma.creditPurchase.findMany({ where: { userId } });
  const totalCreditCount = creditPurchaseData.reduce((acc, cur) => (acc = acc + cur.purchasedCredit), 0);
  const creditUsageCount = await prisma.courseBooking.count({
    where: {
      userId,
      cancelledAt: null,
    },
  });
  if (totalCreditCount - creditUsageCount <= 0) {
    return next(errorHandler(400, "已無可使用堂數"));
  }

  const totalParticipantsCount = await prisma.courseBooking.count({
    where: {
      courseId,
      cancelledAt: null,
    },
  });
  if (targetCourse.maxParticipants - totalParticipantsCount <= 0) {
    return next(errorHandler(400, "已達最大參加人數，無法參加"));
  }

  await prisma.courseBooking.create({
    data: {
      userId,
      courseId,
    },
  });

  res.status(201).json({
    status: "success",
    data: null,
  });
};

export const cancelBookingCourse = async (req, res, next) => {
  const { courseId } = req.params;
  const { id: userId } = req.user;

  if (!validator.isUUID(courseId)) {
    return next(errorHandler(400, "ID錯誤"));
  }

  const hasBooking = await prisma.courseBooking.findFirst({
    where: {
      userId,
      courseId,
      cancelledAt: null,
    },
  });
  if (!hasBooking) {
    return next(errorHandler(400, "ID錯誤"));
  }

  await prisma.courseBooking.update({
    where: {
      id: hasBooking.id,
    },
    data: {
      cancelledAt: new Date(),
    },
  });

  res.status(200).json({
    status: "success",
    data: null,
  });
};
