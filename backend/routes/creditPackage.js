import express from "express";
import { getCreditPackage, createCreditPackage, deleteCreditPackage } from "../controllers/creditPackage.js";
const router = express.Router();

router.get("/", getCreditPackage);
router.post("/", createCreditPackage);
router.delete("/:creditPackageId", deleteCreditPackage);

export default router;
