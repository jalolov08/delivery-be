import { Request, Response } from "express";
import Category from "../models/category.model";
import { compressImage } from "../utils/compressImage";
import Subcategory from "../models/subcategory.model";

export async function createCategory(req: Request, res: Response) {
  const { name } = req.body;
  const photoFile = req.file?.path;
  let photoUri = "";
  const outputDirectory = "uploads/users";

  if (!name || !photoFile) {
    res.status(400).json({ error: "Пожалуйста заполните поля." });
    return;
  }

  try {
    photoUri = await compressImage(photoFile, outputDirectory, 40, 40);

    const category = await Category.create({
      name,
      photoUri,
    });
    res.status(201).json({
      message: "Категория успешно создана.",
      category,
    });
  } catch (error) {
    console.error("Ошибка создание категории:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function updateCategory(req: Request, res: Response) {
  const { id } = req.params;
  const { name } = req.body;
  const photoFile = req.file?.path;
  let photoUri = "";
  const outputDirectory = "uploads/categories";

  if (!name && !photoFile) {
    res
      .status(400)
      .json({ error: "Пожалуйста укажите хотя бы одно поле для обновления." });
    return;
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ error: "Категория не найдена." });
      return;
    }

    if (photoFile) {
      photoUri = await compressImage(photoFile, outputDirectory, 40, 40);
    }

    category.name = name || category.name;
    category.photoUri = photoFile || category.photoUri;

    await category.save();

    res.status(200).json({
      message: "Категория успешно обновлена.",
      category,
    });
  } catch (error) {
    console.error("Ошибка при обновлении категории:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function deleteCategory(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      res.status(404).json({ error: "Категория не найдена." });
      return;
    }

    res.status(200).json({
      message: "Категория успешно удалена.",
    });
  } catch (error) {
    console.error("Ошибка при удалении категории:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await Category.find();

    res.status(200).json({
      message: "Категории успешно получены.",
      categories,
    });
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function getStructuredCategories(req: Request, res: Response) {
  try {
    const categories = await Category.find();

    const structuredCategories = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await Subcategory.find({
          category: category._id,
        });

        return {
          name: category.name,
          photoUri: category.photoUri,
          subcategories: subcategories.map((subcategory) => ({
            name: subcategory.name,
            photoUri: subcategory.photoUri,
          })),
        };
      })
    );

    res.status(200).json({
      message: "Категории успешно получены.",
      categories: structuredCategories,
    });
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
