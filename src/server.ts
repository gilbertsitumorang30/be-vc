import app from "./app.js";
import { appConfig } from "./config/app-config.js";
import logger from "./lib/logger.js";

app.listen(appConfig.PORT, () => {
  logger.info(
    `server running in ${appConfig.NODE_ENV} mode on ${appConfig.PORT} ...`,
  );
});
