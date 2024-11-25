import mongoose, { Schema } from "mongoose";
import { IToken } from "../types/token.type";

const TokenSchema = new Schema<IToken>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    refreshToken: { type: String, required: true },
  },

  { timestamps: true }
);

const Token = mongoose.model<IToken>("Token", TokenSchema);

export default Token;
