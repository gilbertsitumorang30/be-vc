import express from "express";

import { authController } from "./auth-controller.js";
import { zodValidate } from "../../middlewares/vallidate-middleware.js";
import { loginSchema, registerSchema } from "./auth-schema.js";

const router = express.Router();

router.post(
  "/login",
  zodValidate({
    body: loginSchema,
  }),
  authController.login,
);

router.post(
  "/register",
  zodValidate({
    body: registerSchema,
  }),
  authController.register,
);

export default router;
