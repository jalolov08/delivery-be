import { Request, Response } from "express";
import { adminPasswordHash, adminUsername } from "../config";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";
import { IUser } from "../types/user.type";
import Setting from "../models/setting.model";

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
export async function updateSetting(req: Request, res: Response) {
  const { lat, lon, radius, maxWeight, pricePerKm, pricePerKg } = req.body;

  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = new Setting({
        lat,
        lon,
        radius,
        maxWeight,
        pricePerKm,
        pricePerKg,
      });
    } else {
      if (lat !== undefined) settings.lat = lat;
      if (lon !== undefined) settings.lon = lon;
      if (radius !== undefined) settings.radius = radius;
      if (maxWeight !== undefined) settings.maxWeight = maxWeight;
      if (pricePerKm !== undefined) settings.pricePerKm = pricePerKm;
      if (pricePerKg !== undefined) settings.pricePerKg = pricePerKg;
    }

    await settings.save();

    res
      .status(200)
      .json({ message: "Глобальные настройки успешно обновлены.", settings });
  } catch (error) {
    console.error("Ошибка при обновлении глобальных настроек:", error);
    res
      .status(500)
      .json({ error: "Ошибка при обновлении данных. Попробуйте снова." });
  }
}
