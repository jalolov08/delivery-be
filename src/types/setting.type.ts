import { Document } from "mongoose";

export interface ISetting extends Document {
  lat: number;
  lon: number;
  radius: number;
  maxWeight: number;
  pricePerKm: number;
  pricePerKg: number;
}
