import jwt from "jsonwebtoken";
import { jwtRefreshSecret, jwtSecret } from "../config";
import { IUser } from "../types/user.type";

export function generateToken(
    user: IUser,
    tokenType: "access" | "refresh" = "access",
    isAdmin: boolean = false
) {
    let expiresIn: string;

    if (tokenType === "access") {
        expiresIn = isAdmin ? "1d" : "30m";
    } else {
        expiresIn = "60d";
    }

    const secret = tokenType === "access" ? jwtSecret : jwtRefreshSecret;

    return jwt.sign(
        {
            _id: user._id,
            isAdmin
        },
        secret,
        { algorithm: "HS256", expiresIn }
    );
}
