import { Router } from "express";
import { changeProfile, getMe } from "../controllers/user.controller";
import checkAuth from "../utils/checkAuth";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const userRouter: Router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/users");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

const upload = multer({ storage: storage });

userRouter.get("/me", checkAuth, getMe)
userRouter.put("/profile", checkAuth, upload.single("photo"), changeProfile)