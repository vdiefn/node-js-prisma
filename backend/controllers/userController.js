import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import validator from "validator";
import errorHandler from "../utils/errorHandler.js";
import { isValidString, isValidPassword } from "../utils/validation.js";

export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!isValidString(name.trim()) || !validator.isEmail(email.trim()) || !isValidString(password.trim())) {
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

  res.status(200).json({ status: "success", data: user });
};
