import { Router } from "express";
import checkAuth from "../utils/checkAuth";
import {
  assignCourier,
  changeOrderStatus,
  createOrder,
  createOrderDetails,
  getMyOrders,
  getOrder,
  getOrders,
} from "../controllers/order.controller";
import checkAdmin from "../utils/checkAdmin";

export const orderRouter = Router();

orderRouter.post("/details", checkAuth, createOrderDetails);
orderRouter.post("/", checkAuth, createOrder);
orderRouter.post(
  "/:orderId/assign-courier",
  checkAuth,
  checkAdmin,
  assignCourier
);
orderRouter.get("/my", checkAuth, getMyOrders);
orderRouter.get("/:id", checkAuth, getOrder);
orderRouter.get("/", checkAuth, checkAdmin, getOrders);
orderRouter.patch("/:id/status", checkAuth, checkAdmin, changeOrderStatus);
