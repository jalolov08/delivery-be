import mongoose, { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  categoryId: mongoose.Types.ObjectId;
  categoryName: string;
  subcategoryId: mongoose.Types.ObjectId;
  subcategoryName: string;
  deliveryTime: number;
  weight: number;
  price: number;
  photos: string[];
  date: string;
}
