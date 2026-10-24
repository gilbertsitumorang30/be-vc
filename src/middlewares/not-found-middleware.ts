import type { Request, Response, NextFunction } from "express";
import AppError from "../errors/app-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404, {
      code: ERROR_CODES.ROUTE_NOT_FOUND,
    }),
  );
};
