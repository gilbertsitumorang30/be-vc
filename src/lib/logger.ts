import pino from "pino";
import { appConfig } from "../config/app-config.js";

const logger = pino({
  level: appConfig.LOG_LEVEL,
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "req.body.password",
    "req.body.token",
    "req.body.accessToken",
    "req.body.refreshToken",
  ],

  ...((appConfig.NODE_ENV === "development" ||
    appConfig.NODE_ENV === "test") && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  }),
});

export default logger;
