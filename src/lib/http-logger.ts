import { pinoHttp } from "pino-http";
import logger from "./logger.js";
import pino from "pino";

export const httpLogger = pinoHttp({
  logger,

  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },

  customLogLevel: (req, res, err) => {
    if (err || res.statusCode >= 500) {
      return "error";
    }

    if (res.statusCode >= 400) {
      return "warn";
    }

    return "info";
  },

  customSuccessMessage: (req, res) => {
    return `HTTP ${req.method} ${req.url} ${res.statusCode}`;
  },

  customErrorMessage: (req, res, err) => {
    return `HTTP ${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
  },
});
