import { Schema, model } from "mongoose";
import { IChapter } from "../types/chapter.type";

const ChapterSchema = new Schema<IChapter>(
  {
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, required: true },
    subcategory: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const Chapter = model<IChapter>("Chapter", ChapterSchema);

export default Chapter;
