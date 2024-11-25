import { Schema, model } from "mongoose";
import { IUser } from "../types/user.type";

const UserSchema = new Schema<IUser>({
    name: { type: String, required: false },
    surname: { type: String, required: false },
    photoUri: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    googleId: { type: String, required: false }
}, { timestamps: true })

const User = model<IUser>("User", UserSchema);

export default User;