import jwt from "jsonwebtoken";
import errorHandler from "../utils/errorHandler.js";

const SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(errorHandler(401, "請先登入"));
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(errorHandler(401, "Token 已過期"));
    } else if (error.name === "JsonWebTokenError") {
      return next(errorHandler(401, "無效的 token"));
    } else {
      return next(errorHandler(401, "身分驗證失敗"));
    }
  }
};
