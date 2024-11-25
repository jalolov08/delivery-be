import express, { Router } from "express";
import { authRouter } from "./auth.routes";
import { userRouter } from "./user.route";

export const router: Router = express.Router();

router.use("/auth", authRouter)
router.use("/user", userRouter)