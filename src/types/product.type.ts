import mongoose, { Document } from "mongoose";

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  categoryId: mongoose.Types.ObjectId;
  categoryName: string;
  subcategoryId: mongoose.Types.ObjectId;
  subcategoryName: string;
  deliveryTime: number;
  weight: number;
  price: number;
  videoUri: string;
  photos: string[];
  date: string;
  chapterId: mongoose.Types.ObjectId;
  chapterName: string;
}
