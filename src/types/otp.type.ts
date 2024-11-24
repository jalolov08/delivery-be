import { Document } from "mongoose";

export interface IOtp extends Document {
    phone: string;
    code: string;
    verificationAttempts: number;
    updatedAt: Date
}