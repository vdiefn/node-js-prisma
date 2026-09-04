import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  getCreditPackage,
  createCreditPackage,
  deleteCreditPackage,
  purchaseCreditPackage,
} from "../controllers/creditPackage.js";
const router = express.Router();

router.get("/", getCreditPackage);
router.post("/", createCreditPackage);
router.post("/:creditPackageId", verifyToken, purchaseCreditPackage);
router.delete("/:creditPackageId", deleteCreditPackage);

export default router;
