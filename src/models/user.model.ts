import { Schema, model } from "mongoose";
import { IUser } from "../types/user.type";
import { IAddress } from "../types/address.type";

export const AddressSchema = new Schema<IAddress>({
  city: { type: String, required: true },
  country: { type: String, required: true },
  street: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  entrance: { type: String, required: true },
  floor: { type: Number, required: true },
  apartment: { type: String, required: true },
  house: { type: String, required: true },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: false },
    surname: { type: String, required: false },
    photoUri: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    googleId: { type: String, required: false },
    address: {
        type: [AddressSchema],
        validate: [arrayLimit, "{PATH} exceeds the limit of 3"],
      },
  },
  { timestamps: true }
);

function arrayLimit(val: any[]) {
    return val.length <= 3;
  }

const User = model<IUser>("User", UserSchema);

export default User;
