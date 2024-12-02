import { Schema, model } from "mongoose";
import { ICategory } from "../types/category.type";

const CategorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
    photoUri: { type: String, required: true }
}, { timestamps: true })

const Category = model<ICategory>("Category", CategorySchema);

export default Category;