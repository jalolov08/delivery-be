import { Schema, model } from "mongoose";
import { IOtp } from "../types/otp.type";

const OtpSchema = new Schema<IOtp>({
    phone: { type: String, required: true },
    code: { type: String, required: true },
    verificationAttempts: { type: Number, default: 0 },
    updatedAt: {
        type: Date,
        default: Date.now,
      },
}, { timestamps: true })

const Otp = model<IOtp>("Otp", OtpSchema);

export default Otp;
