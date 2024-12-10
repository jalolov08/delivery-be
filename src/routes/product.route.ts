import { Router } from "express";
import checkAuth from "../utils/checkAuth";
import checkAdmin from "../utils/checkAdmin";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getSimilarProducts,
  updateProduct,
} from "../controllers/product.controller";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const productRouter: Router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});
const upload = multer({ storage: storage });

productRouter.post(
  "/",
  checkAuth,
  checkAdmin,
  upload.array("photos"),
  createProduct
);
productRouter.put(
  "/:id",
  checkAuth,
  checkAdmin,
  upload.array("photos"),
  updateProduct
);
productRouter.delete("/:id", checkAuth, checkAdmin, deleteProduct);
productRouter.get("/", checkAuth, getProducts);
productRouter.get("/:id", checkAuth, getProduct);
productRouter.get("/:id/similar", checkAuth, getSimilarProducts);
