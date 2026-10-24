import type { AppJwtPayload } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      payload?: AppJwtPayload;
    }
  }
}

export {};
