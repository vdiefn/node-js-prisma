import { prisma } from "../lib/prisma.js";
import validator from "validator";
import errorHandler from "../utils/errorHandler.js";
import { isValidString, isValidInteger } from "../utils/validation.js";

export const getCreditPackage = async (req, res, next) => {
  const data = await prisma.creditPackage.findMany();

  res.status(200).json({ status: "success", data });
};

export const createCreditPackage = async (req, res, next) => {
  const { name, credit_amount: creditAmount, price } = req.body;

  if (!isValidString(name) || !isValidInteger(creditAmount) || !isValidInteger(price)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const hasName = await prisma.creditPackage.findUnique({ where: { name } });
  if (hasName) {
    return next(errorHandler(409, "資料重複"));
  }

  const newData = await prisma.creditPackage.create({
    data: { name, creditAmount, price },
    select: {
      id: true,
      name: true,
      creditAmount: true,
      price: true,
      createdAt: true,
    },
  });

  const data = {
    id: newData.id,
    name: newData.name,
    credit_amount: newData.CreditAmount,
    price: newData.price,
    created_at: newData.creditedAt,
  };

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

export const purchaseCreditPackage = async (req, res, next) => {
  const { creditPackageId } = req.params;
  const { id: userId } = req.user;

  if (!validator.isUUID(creditPackageId)) {
    return next(errorHandler(400, "ID錯誤"));
  }

  const targetPackage = await prisma.creditPackage.findUnique({ where: { id: creditPackageId.trim() } });
  if (!targetPackage) {
    return next(errorHandler(400, "ID錯誤"));
  }

  await prisma.creditPurchase.create({
    data: {
      userId,
      creditPackageId,
      purchasedCredit: targetPackage.creditAmount,
      pricePaid: targetPackage.price,
    },
  });

  res.status(201).json({ status: "success", data: null });
};
