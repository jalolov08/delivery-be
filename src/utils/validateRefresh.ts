import { jwtRefreshSecret } from "../config";
import Token from "../models/token.model";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export async function validateRefresh(refreshToken: string) {

    if (!refreshToken) {
        throw new Error("Токен не предоставлен");
    }

    const existingToken = await Token.findOne({ refreshToken });

    if (!existingToken) {
        throw new Error("Неверный или истекший refresh токен");
    }
    const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as { _id: string };
    const user = await User.findById(decoded._id)
    if (!user) {
        throw new Error("Пользователь не найден.");
    }

    return { existingToken, user };

}