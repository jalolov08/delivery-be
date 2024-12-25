import mongoose, { Document } from "mongoose";
import { IAddress } from "./address.type";

export enum OrderStatus {
  PENDING = "В ожидании",
  COURIER_ASSIGNED = "Курьер назначен",
  COURIER_PICKED_UP = "Курьер забрал",
  DELIVERED = "Доставлен",
  CANCELED = "Отменен",
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  userPhone: string;
  address: IAddress;
  products: {
    productId: mongoose.Types.ObjectId;
    name: string;
    photo: string;
    quantity: number;
    price: number;
    weight: number;
    totalPrice: number;
    totalWeight: number;
  }[];
  weight: number;
  distance: number;
  deliveryAmount: number;
  orderAmount: number;
  total: number;
  status: OrderStatus;
  track: string;
  comment?: string;
  courierName?: string;
  courierSurname?: string;
  courierPhone?: string;
  date: string;
}
