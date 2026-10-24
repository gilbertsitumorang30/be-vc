import jwt from "jsonwebtoken";
import { appConfig } from "../config/app-config.js";
import AppError from "../errors/app-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";

export type AppJwtPayload = {
  sub: number;
  username: string;
};

export const generateToken = (payload: AppJwtPayload) => {
  return jwt.sign(payload, appConfig.JWT_SECRET, {
    expiresIn: appConfig.JWT_EXPIRED_IN,
  });
};

export const verifyToken = (token: string): AppJwtPayload => {
  const decode = jwt.verify(token, appConfig.JWT_SECRET);
  if (
    typeof decode === "string" ||
    typeof decode.sub !== "number" ||
    typeof decode.username !== "string"
  ) {
    throw new AppError("Invalid token payload", 401, {
      code: ERROR_CODES.UNAUTHORIZED,
    });
  }
  return {
    sub: decode.sub,
    username: decode.username,
  };
};
