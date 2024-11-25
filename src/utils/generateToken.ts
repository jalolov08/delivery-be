import jwt from "jsonwebtoken";
import { jwtRefreshSecret, jwtSecret } from "../config";
import { IUser } from "../types/user.type";

export function generateToken(
    user: IUser,
    tokenType: "access" | "refresh" = "access"
) {
    const expiresIn = tokenType === "access" ? "30m" : "60d";
    const secret = tokenType === "access" ? jwtSecret : jwtRefreshSecret
        ;

    return jwt.sign(
        {
            _id: user._id,
        },
        secret,
        { algorithm: "HS256", expiresIn }
    );
}
