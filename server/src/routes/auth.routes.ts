import { Router } from "express";

import {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
} from "../controllers/auth.controller";

import { validateBody } from "../middlewares/validateBody.middleware";
import { authUser, validateRefreshToken } from "../middlewares/auth.middleware";

import { registerSchema, loginSchema } from "../schemas/auth.schema";

export let authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), registerController);
authRouter.post("/login", validateBody(loginSchema), loginController);
authRouter.post("/logout", authUser, logoutController);
authRouter.post("/refresh-token", validateRefreshToken, refreshTokenController);
