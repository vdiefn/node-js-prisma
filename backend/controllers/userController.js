import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import errorHandler from "../utils/errorHandler.js";
import { isValidString, isValidPassword } from "../utils/validation.js";

export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!isValidString(name) || !isValidString(email) || !validator.isEmail(email.trim()) || !isValidString(password)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  if (!isValidPassword(password)) {
    return next(errorHandler(400, "「密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字」"));
  }

  const hasEmail = await prisma.user.findUnique({ where: { email } });
  if (hasEmail) {
    return next(errorHandler(409, "Email 已被使用"));
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password.trim(), salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
    select: {
      id: true,
      name: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: { user: { id: user.id, name: user.name } },
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email) || !isValidString(password)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }
  if (!isValidString(password)) {
    return next(errorHandler(400, "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"));
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim() } });
  if (!user) {
    return next(errorHandler(400, "使用者不存在或密碼輸入錯誤"));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(errorHandler(400, "使用者不存在或密碼輸入錯誤"));
  }

  const payload = { id: user.id, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  res.status(201).json({
    status: "success",
    data: {
      token,
      user: {
        name: user.name,
      },
    },
  });
};

export const getUserProfile = async (req, res, next) => {
  const id = req.user.id;

  const user = await prisma.user.findUnique({ where: { id } });

  res.status(200).json({
    status: "success",
    data: {
      user: {
        name: user.name,
        email: user.email,
      },
    },
  });
};

export const updateUserProfile = async (req, res, next) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (!isValidString(name)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const userData = await prisma.user.findUnique({ where: { id: userId } });
  if (userData.name == name.trim()) {
    return next(errorHandler(400, "使用者名稱未變更"));
  }

  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: name.trim(),
    },
    select: {
      name: true,
    },
  });

  res.status(200).json({ status: "success", data: { user: updateUser } });
};

export const updateUserPassword = async (req, res, next) => {
  const { password, new_password, confirm_new_password } = req.body;
  const userId = req.user.id;

  if (!isValidString(password) || !isValidString(new_password) || !isValidString(confirm_new_password)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  if (!isValidPassword(password) || !isValidPassword(new_password) || !isValidPassword(confirm_new_password)) {
    return next(errorHandler(400, "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"));
  }

  if (password === new_password) {
    return next(errorHandler(400, "新密碼不能與舊密碼相同"));
  }

  if (new_password !== confirm_new_password) {
    return next(errorHandler(400, "新密碼與驗證新密碼不一致"));
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(errorHandler(400, "密碼輸入錯誤"));
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(new_password, salt);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashPassword,
    },
  });

  res.status(200).json({ status: "success", data: null });
};

export const getPurchaseDetail = async (req, res, next) => {
  const { id: userId } = req.user;

  const purchaseData = await prisma.creditPurchase.findMany({
    where: {
      userId,
    },
    select: {
      purchasedCredit: true,
      pricePaid: true,
      purchasedAt: true,
      creditPackage: {
        select: {
          name: true,
        },
      },
    },
  });

  const data = purchaseData.map((i) => {
    return {
      name: i.creditPackage.name,
      purchased_credits: i.purchasedCredit,
      price_paid: i.pricePaid,
      purchase_at: i.purchasedAt,
    };
  });

  res.status(200).json({
    status: "success",
    data,
  });
};
