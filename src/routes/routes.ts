import { Router } from "express";
import { authRouter } from "./auth.routes";
import { userRouter } from "./user.route";
import { adminRouter } from "./admin.route";
import { categoryRouter } from "./category.route";
import { subcategoryRouter } from "./subcategory.route";
import { productRouter } from "./product.route";

export const router: Router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/category", categoryRouter);
router.use("/subcategory", subcategoryRouter);
router.use("/product", productRouter);
