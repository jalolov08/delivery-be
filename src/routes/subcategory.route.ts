import { Router } from "express";
import checkAuth from "../utils/checkAuth";
import checkAdmin from "../utils/checkAdmin";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import {
  createSubcategory,
  deleteSubcategory,
  getSubcategories,
  getSubcategoriesByCategory,
  updateSubcategory,
} from "../controllers/subcategory.controller";

export const subcategoryRouter: Router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/subcategories");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

subcategoryRouter.post(
  "/",
  checkAuth,
  checkAdmin,
  upload.single("photo"),
  createSubcategory
);
subcategoryRouter.put(
  "/:id",
  checkAuth,
  checkAdmin,
  upload.single("photo"),
  updateSubcategory
);
subcategoryRouter.put(
  "/:id",
  checkAuth,
  checkAdmin,
  upload.single("photo"),
  updateSubcategory
);
subcategoryRouter.delete("/:id", checkAuth, checkAdmin, deleteSubcategory);
subcategoryRouter.get("/", checkAuth, getSubcategories);
subcategoryRouter.get("/:id", checkAuth, getSubcategoriesByCategory);
