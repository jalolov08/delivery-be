import { Request, Response } from "express";
import User from "../models/user.model";
import { compressImage } from "../utils/compressImage";

export async function getMe(req: Request, res: Response) {
    const userId = req.user?._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "Пользователь не найден" });
            return;
        }

        res.status(200).json({
            message: "Данные пользователя получены успешно",
            user,
        });
    } catch (error) {
        console.error("Ошибка при получение данных юзера:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
}
export async function changeProfile(req: Request, res: Response) {
    const userId = req.user._id
    const { name, surname } = req.body
    const photoFile = req.file?.path;
    let photoUri = "";
    const outputDirectory = "uploads/users";

    try {
        if (photoFile) {
            photoUri = await compressImage(photoFile, outputDirectory, 40, 40);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: { name, surname, photoUri },
            },
            { new: true }
        );
        res.status(200).json({
            message: "Профиль успешно обновлен",
            updatedUser,
        });
    } catch (error) {
        console.error("Ошибка при обновление данных юзера:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }

}