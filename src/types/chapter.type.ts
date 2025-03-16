import mongoose, { Document } from "mongoose";

export interface IChapter extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  subcategory: mongoose.Types.ObjectId;
}
