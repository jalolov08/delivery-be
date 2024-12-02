import { Schema, model } from "mongoose";
import { ISubcategory } from "../types/subcategory.type";

const SubcategorySchema = new Schema<ISubcategory>({
    category: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    photoUri: { type: String, required: true }
}, { timestamps: true })

const Subcategory = model<ISubcategory>("Subcategory", SubcategorySchema);

export default Subcategory;