import { Router } from "express";
import { login, updateSetting } from "../controllers/admin.controller";
import checkAuth from "../utils/checkAuth";
import checkAdmin from "../utils/checkAdmin";

export const adminRouter: Router = Router();

adminRouter.post("/login", login);
adminRouter.put("/setting", checkAuth, checkAdmin, updateSetting);
