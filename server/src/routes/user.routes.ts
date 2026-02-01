import { Router } from "express";

import { userController } from "../controllers/user.controller";

import { authUser } from "../middlewares/auth.middleware";

export let userRouter = Router();

userRouter.get("/", authUser, userController);
