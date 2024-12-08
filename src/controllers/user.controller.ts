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
  const userId = req.user._id;
  const { name, surname } = req.body;
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
export async function createAddress(req: Request, res: Response) {
  const userId = req.user._id;
  const {
    country,
    city,
    street,
    latitude,
    longitude,
    entrance,
    floor,
    apartment,
    house,
  } = req.body;

  try {
    if (
      !country ||
      !city ||
      !street ||
      !latitude ||
      !longitude ||
      !entrance ||
      !floor ||
      !apartment ||
      !house
    ) {
      res.status(400).json({ error: "Пожалуйста заполните поля." });
      return;
    }
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        error: "Пользователь не найден.",
      });
      return;
    }

    if (user.address.length >= 3) {
      res.status(400).json({
        error: "Достигнут макс. лимит адресов.",
      });
      return;
    }

    const newAddress = {
      country,
      city,
      street,
      latitude,
      longitude,
      entrance,
      floor,
      apartment,
      house,
    };

    user.address.push(newAddress);
    await user.save();

    res.status(201).json({
      message: "Адрес успешно добавлен.",
      user,
    });
  } catch (error) {
    console.error("Ошибка при добавление адреса:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function deleteAddress(req: Request, res: Response) {
  const userId = req.user._id;
  const id = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        error: "Пользователь не найден.",
      });
      return;
    }

    const address = user.address.find(
      (address) => address._id?.toString() === id
    );

    if (!address) {
      res.status(404).json({
        error: "Адрес не найден.",
      });
      return;
    }

    const addressIndex = user.address.indexOf(address);
    user.address.splice(addressIndex, 1);

    await user.save();

    res.status(200).json({
      message: "Адрес успешно удален.",
      user,
    });
  } catch (error) {
    console.error("Ошибка при удаление адреса:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function updateAddress(req: Request, res: Response) {
  const userId = req.user._id;
  const id = req.params.id;
  const {
    country,
    city,
    street,
    latitude,
    longitude,
    entrance,
    floor,
    apartment,
    house,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        error: "Пользователь не найден.",
      });
      return;
    }

    const address = user.address.find(
      (address) => address._id?.toString() === id
    );
    if (!address) {
      res.status(404).json({
        error: "Адрес не найден.",
      });
      return;
    }

    address.country = country || address.country;
    address.city = city || address.city;
    address.street = street || address.street;
    address.latitude = latitude || address.latitude;
    address.longitude = longitude || address.longitude;
    address.entrance = entrance || address.entrance;
    address.floor = floor || address.floor;
    address.apartment = apartment || address.apartment;
    address.house = house || address.house;

    await user.save();

    res.status(200).json({
      message: "Адрес успешно обновлен.",
      address,
    });
  } catch (error) {
    console.error("Произошла ошибка при обновлении адреса:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
