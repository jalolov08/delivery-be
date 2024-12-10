import { Request, Response } from "express";
import { adminPasswordHash, adminUsername } from "../config";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";
import { IUser } from "../types/user.type";

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  if (username !== adminUsername) {
    res.status(403).json({ error: "Неверное имя пользователя или пароль" });
    return;
  }
  try {
    const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);

    if (!isPasswordValid) {
      res.status(403).json({ errpr: "Неверное имя пользователя или пароль" });
      return;
    }

    const token = generateToken({} as IUser, "access", true);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
}
