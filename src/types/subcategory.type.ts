import { Document, Types } from "mongoose";


export interface ISubcategory extends Document {
    category: Types.ObjectId;
    name: string;
    photoUri: string;
}