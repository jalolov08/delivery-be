import express, { Router } from "express";
import { googleAuth, logout, refreshToken, sendOtp, verifyOtp } from "../controllers/auth.controller";
import checkAuth from "../utils/checkAuth";

export const authRouter: Router = express.Router();

authRouter.post("/send-otp", sendOtp)
authRouter.post("/verify-otp", verifyOtp)
authRouter.post("/google", googleAuth)
authRouter.get("/refresh-token", refreshToken)
authRouter.post("/logout", checkAuth, logout)