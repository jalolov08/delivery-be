import { Router } from "express";
import checkAuth from "../utils/checkAuth";
import checkAdmin from "../utils/checkAdmin";
import { createCategory, deleteCategory, getCategories, getStructuredCategories, updateCategory } from "../controllers/category.controller";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const categoryRouter: Router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/categories");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

const upload = multer({ storage: storage });

categoryRouter.post("/", checkAuth, checkAdmin, upload.single("photo"), createCategory)
categoryRouter.put("/:id", checkAuth, checkAdmin, upload.single("photo"), updateCategory)
categoryRouter.delete("/:id", checkAuth, checkAdmin, deleteCategory)
categoryRouter.get("/", checkAuth, getCategories)
categoryRouter.get("/structured", checkAuth, getStructuredCategories)