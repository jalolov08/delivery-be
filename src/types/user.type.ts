import { Document } from "mongoose";

export interface IUser extends Document {
    name?: string;
    surname?: string;
    phone?: string;
    email?: string;
    photoUri?: string;
    googleId?: string;
}