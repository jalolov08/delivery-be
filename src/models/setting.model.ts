import { Schema, model } from "mongoose";
import { ISetting } from "../types/setting.type";

const SettingSchema = new Schema<ISetting>(
  {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    radius: { type: Number, required: true },
    maxWeight: { type: Number, required: true },
    pricePerKm: { type: Number, required: true },
    pricePerKg: { type: Number, required: true },
  },
  { timestamps: true }
);

const Setting = model<ISetting>("Setting", SettingSchema);

export default Setting;
