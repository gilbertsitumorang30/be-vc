import express from "express";
import asyncHandler from "../../middlewares/async-handler.js";
import { successResponse } from "../../utils/response.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler((_req, res) => {
    return successResponse(res, "Service is Healtny", 200, { status: "ok" });
  }),
);

export default router;
