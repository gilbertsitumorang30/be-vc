import type { Request, Response } from "express";
import asyncHandler from "../../middlewares/async-handler.js";
import { successResponse } from "../../utils/response.js";
import type { LoginInput, RegisterInput } from "./auth-schema.js";
import { authService } from "./auth-service.js";

const register = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as RegisterInput;

  const newUser = await authService.register(data);

  return successResponse(res, "User registered successfully", 201, newUser);
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as LoginInput;

  const loginResult = await authService.login(data);

  return successResponse(res, "User login successfully", 200, loginResult);
});

export const authController = {
  register,
  login,
};
