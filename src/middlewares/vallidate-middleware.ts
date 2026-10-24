import type { Request, Response, NextFunction } from "express";
import type { ZodError, ZodType } from "zod";
import AppError from "../errors/app-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";

type typeOfScheme = { body?: ZodType; params?: ZodType; query?: ZodType };

export const zodValidate = ({ body, params, query }: typeOfScheme) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (params) {
      const result = params.safeParse(req.params);
      if (!result.success) {
        return next(createValidationError(result.error));
      }
    }

    if (body) {
      const result = body.safeParse(req.body);
      if (!result.success) {
        return next(createValidationError(result.error));
      }
    }

    if (query) {
      const result = query.safeParse(req.query);
      if (!result.success) {
        return next(createValidationError(result.error));
      }
    }

    next();
  };
};

const createValidationError = (error: ZodError) => {
  return new AppError("Validation Failed", 400, {
    code: ERROR_CODES.VALIDATION_ERROR,
    errors: error.issues.map((issue) => {
      return {
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      };
    }),
  });
};
