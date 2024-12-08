import { Document } from "mongoose";
import { IAddress } from "./address.type";

export interface IUser extends Document {
  name?: string;
  surname?: string;
  phone?: string;
  email?: string;
  photoUri?: string;
  googleId?: string;
  address: IAddress[];
}