import { Router } from "express";
import { login } from "../controllers/admin.controllert";

export const adminRouter: Router = Router();

adminRouter.post("/login", login);
