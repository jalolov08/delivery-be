import { Schema, model } from "mongoose";
import { IOrder, OrderStatus } from "../types/order.type";
import { AddressSchema } from "./user.model";
import {
  generateRandomDigits,
  generateRandomLetters,
  getCurrentDateTime,
} from "../utils/random";
import dayjs from "dayjs";

const OrderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userPhone: {
    type: String,
    required: true,
  },
  address: {
    type: AddressSchema,
    required: true,
  },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      photo: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      weight: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
      totalWeight: { type: Number, required: true },
    },
  ],
  weight: { type: Number, required: true },
  distance: { type: Number, required: true },
  deliveryAmount: { type: Number, required: true },
  orderAmount: { type: Number, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true,
    default: OrderStatus.PENDING,
  },
  track: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      const randomDigits1 = generateRandomDigits(2);
      const randomLetters1 = generateRandomLetters(2);
      const currentDateTime = getCurrentDateTime();

      return `${randomDigits1}-${randomLetters1}-${currentDateTime}`;
    },
  },
  comment: { type: String, required: false },
  courierName: { type: String, required: false },
  courierSurname: { type: String, required: false },
  courierPhone: { type: String, required: false },
  date: { type: String, default: () => dayjs().format("DD.MM.YYYY HH:mm") },
});

const Order = model<IOrder>("Order", OrderSchema);

export default Order;
