import type {
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import logger from "../lib/logger.js";
import { AppError, ERROR_CODES } from "../errors/index.js";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    logger.warn(
      {
        err,
        method: req.method,
        url: req.originalUrl,
      },
      err.message,
    );

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.code && { code: err.code }),
      ...(err.errors && { errors: err.errors }),
    });
  }

  logger.error(
    {
      err,
      method: req.method,
      url: req.originalUrl,
    },
    "Unhandled Error",
  );

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
  });
};
