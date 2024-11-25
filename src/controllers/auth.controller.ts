import { Request, Response } from "express";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import Otp from "../models/otp.model";
import bcrypt from "bcrypt"
import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import Token from "../models/token.model";
import { OAuth2Client } from "google-auth-library"
import { clientId } from "../config";
import { validateRefresh } from "../utils/validateRefresh";

const client = new OAuth2Client(`${clientId}.apps.googleusercontent.com`);
const MAX_VERIFICATION_ATTEMPTS = 5;
const VERIFICATION_TIMEOUT_MINUTES = 30;

export async function sendOtp(req: Request, res: Response) {
    const phone = req.body.phone;
    if (!phone) {
        res.status(400).json({ error: "Пожалуйста предоставьте номер." });
        return;
    }
    try {
        const formattedPhone = formatPhoneNumber(phone);
        if (!formattedPhone) {
            res.status(400).json({ error: "Неверный номер телефона." });
            return;
        }
        let otp = await Otp.findOne({ phone: formattedPhone });
        if (!otp) {
            otp = new Otp({ phone: formattedPhone, verificationAttempts: 0 });
        }
        if (otp.verificationAttempts >= MAX_VERIFICATION_ATTEMPTS) {
            const timeElapsed: number =
                (new Date().getTime() - otp.updatedAt.getTime()) / (1000 * 60);
            if (timeElapsed < VERIFICATION_TIMEOUT_MINUTES) {
                res.status(400).json({
                    error: `Превышено ограничение на количество попыток верификации. Повторите попытку через ${VERIFICATION_TIMEOUT_MINUTES} минут`,
                });
                return;
            } else {
                otp.verificationAttempts = 0;
            }
        }
        const code = "1111";
        const salt = await bcrypt.genSalt(10);
        const hashedCode = await bcrypt.hash(code, salt);
        otp.code = hashedCode;
        await otp.save();
        res
            .status(200)
            .json({ message: "Код верификации успешно отправлен" });
    } catch (error) {
        console.error("Ошибка отправки кода верификации:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
}
export async function verifyOtp(req: Request, res: Response) {
    const { code, phone } = req.body;
    if (!code || !phone) {
        res.status(400).json({ error: "Заполните все поля." });
        return
    }

    try {
        const formattedPhone = formatPhoneNumber(phone);
        if (!formattedPhone) {
            res.status(400).json({ error: "Неверный номер телефона." });
            return;
        }

        let otp = await Otp.findOne({ phone: formattedPhone });
        if (!otp || otp.verificationAttempts >= MAX_VERIFICATION_ATTEMPTS) {
            res.status(400).json({
                error:
                    "Превышено ограничение на количество попыток верификации или неверный номер",
                status: "failed",
            });
            return;
        }

        if (!(await bcrypt.compare(code, otp.code))) {
            otp.verificationAttempts += 1;
            await otp.save();
            res.status(400).json({ error: "Неверный код", status: "failed" });
            return;
        }

        await Otp.deleteOne({ phone: formattedPhone });

        let user = await User.findOne({ phone: formattedPhone });
        let userExist = true;

        if (!user) {
            user = new User({ phone: formattedPhone });
            userExist = false;
        }

        await user.save();
        const token = generateToken(user);
        const refreshToken = generateToken(user, "refresh");

        await Token.findOneAndUpdate(
            { userId: user._id },
            { refreshToken },
            { upsert: true }
        );

        res.status(200).json({
            message: "Верификация прошла успешно",
            token,
            refreshToken,
            userExist,
            user,
        });
    } catch (error) {
        console.error("Ошибка верификации:", error);
        res
            .status(500)
            .json({ error: "Внутренняя ошибка сервера" });
    }
}
export async function googleAuth(req: Request, res: Response) {
    const { idToken } = req.body;

    if (!idToken) {
        res.status(400).json({ message: 'Заполните все поля.' });
        return
    }

    try {
        const ticket = await client.verifyIdToken(
            {
                idToken,
            }
        );

        const payload = ticket.getPayload();
        if (!payload) {
            res.status(400).json({ message: 'Некорректный токен.' });
            return;
        }
        const { sub, email, given_name, family_name, picture } = payload;
        let user = await User.findOne({ googleId: sub });

        if (!user) {
            user = new User({
                googleId: sub,
                email,
                name: given_name,
                surname: family_name,
                photoUri: picture,
            });

            await user.save();
        }
        const token = generateToken(user);
        const refreshToken = generateToken(user, "refresh");

        await Token.findOneAndUpdate(
            { userId: user._id },
            { refreshToken },
            { upsert: true }
        );

        res.status(200).json({
            message: 'Успешный вход.',
            user,
            token,
            refreshToken,
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export async function refreshToken(req: Request, res: Response) {
    const refreshToken = req.query.refreshToken as string;

    try {
        const { existingToken, user } = await validateRefresh(refreshToken);

        const newToken = generateToken(user);
        const newRefreshToken = generateToken(user, "refresh");

        existingToken.refreshToken = newRefreshToken;
        await existingToken.save();

        res.status(200).json({
            message: "Токены обновлены успешно",
            token: newToken,
            refreshToken: newRefreshToken,
        });
    } catch (error: any) {
        console.error("Ошибка обновления токена:", error);
        res.status(500).json({ error: error.message || "Ошибка сервера" });
    }
}
export async function logout(req: Request, res: Response) {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                message: "Пользователь не найден",
            });
            return;
        }
        await Token.findOneAndDelete({ userId });
        res.status(200).json({
            message: "Успешный выход.",
        });
    } catch (error) {
        console.error("Ошибка выхода с аккаунта:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
}