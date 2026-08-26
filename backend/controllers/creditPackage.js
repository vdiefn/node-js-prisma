import { prisma } from "../lib/prisma.js";
import validator from "validator";
import errorHandler from "../utils/errorHandler.js";
import { isValidString, isValidInteger } from "../utils/validation.js";

export const getCreditPackage = async (req, res, next) => {
  const data = await prisma.creditPackage.findMany();

  res.status(200).json({ status: "success", data });
};

export const createCreditPackage = async (req, res, next) => {
  const { name, credit_amount, price } = req.body;

  if (!isValidString(name) || !isValidInteger(credit_amount) || !isValidInteger(price)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const hasName = await prisma.creditPackage.findUnique({ where: { name } });
  if (hasName) {
    return next(errorHandler(409, "資料重複"));
  }

  const data = await prisma.creditPackage.create({
    data: { name, credit_amount, price },
    select: {
      id: true,
      name: true,
      credit_amount: true,
      price: true,
      createdAt: true,
    },
  });

  res.status(200).json({ status: "success", data });
};

export const deleteCreditPackage = async (req, res, next) => {
  const { creditPackageId } = req.params;

  if (!validator.isUUID(creditPackageId.trim())) {
    return next(errorHandler(400, "ID錯誤"));
  }

  const hasCreditPackage = await prisma.creditPackage.findUnique({
    where: { id: creditPackageId.trim() },
  });
  if (!hasCreditPackage) {
    return next(errorHandler(400, "ID錯誤"));
  }

  await prisma.creditPackage.delete({ where: { id: creditPackageId.trim() } });
  res.status(200).json({ status: "success", data: null });
};
