import { Schema, model } from "mongoose";
import { IProduct } from "../types/product.type";
import dayjs from "dayjs";

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, required: true },
    subcategoryId: { type: Schema.Types.ObjectId, required: true },
    categoryName: { type: String, required: true },
    subcategoryName: { type: String, required: true },
    deliveryTime: { type: Number, required: true },
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
    photos: [{ type: String, required: true }],
    date: { type: String, default: () => dayjs().format("DD.MM.YYYY HH:mm") },
    chapterId: { type: Schema.Types.ObjectId, required: true },
    chapterName: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = model<IProduct>("Product", ProductSchema);

export default Product;
