import type { NextFunction, Request, Response } from "express";
import AppError from "../../errors/app-error.js";
import { ERROR_CODES } from "../../errors/error-codes.js";
import { verifyToken } from "../../utils/jwt.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new AppError("Authentication required", 401, {
      code: ERROR_CODES.UNAUTHORIZED,
    });
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer") {
    throw new AppError("Invalid authorization header", 401, {
      code: ERROR_CODES.UNAUTHORIZED,
    });
  }

  if (!token) {
    throw new AppError("Invalid authorization header", 401, {
      code: ERROR_CODES.UNAUTHORIZED,
    });
  }

  try {
    const payload = verifyToken(token);
    req.payload = payload;

    next();
  } catch (error) {
    throw new AppError("Invalid or expired token", 401, {
      code: ERROR_CODES.UNAUTHORIZED,
    });
  }
};
