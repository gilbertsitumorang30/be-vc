import express from "express";
import healtRoute from "../modules/health/health-route.js";
import authRoute from "../modules/auth/auth-route.js";
import { authMiddleware } from "../modules/auth/auth-middleware.js";

const router = express.Router();

router.use("/health", healtRoute);
router.use("/auth", authRoute);
router.use("/test/protected", authMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
  });
});

export default router;
