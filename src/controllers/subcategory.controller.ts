import { Request, Response } from "express";
import Category from "../models/category.model";
import { compressImage } from "../utils/compressImage";
import Subcategory from "../models/subcategory.model";

export async function createSubcategory(req: Request, res: Response) {
  const { name, categoryId } = req.body;
  const photoFile = req.file?.path;
  let photoUri = "";
  const outputDirectory = "uploads/subcategories";

  if (!name || !photoFile || !categoryId) {
    res.status(400).json({ error: "Пожалуйста заполните поля." });
    return;
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404).json({ error: "Категория не найдена." });
      return;
    }
    photoUri = await compressImage(photoFile, outputDirectory, 40, 40);

    const subcategory = await Subcategory.create({
      name,
      category: category._id,
      photoUri,
    });
    res.status(201).json({
      message: "Подкатегория успешно создана.",
      subcategory,
    });
  } catch (error) {
    console.error("Ошибка создание категории:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function updateSubcategory(req: Request, res: Response) {
  const { id } = req.params;
  const { name, categoryId } = req.body;
  const photoFile = req.file?.path;
  let photoUri = "";
  const outputDirectory = "uploads/subcategories";

  if (!name && !photoFile && !categoryId) {
    res
      .status(400)
      .json({ error: "Пожалуйста укажите хотя бы одно поле для обновления." });
    return;
  }

  try {
    const subcategory = await Subcategory.findById(id);
    if (!subcategory) {
      res.status(404).json({ error: "Подкатегория не найдена." });
      return;
    }

    if (name) subcategory.name = name;

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        res.status(404).json({ error: "Категория не найдена." });
        return;
      }
      subcategory.category = categoryId;
    }

    if (photoFile) {
      photoUri = await compressImage(photoFile, outputDirectory, 40, 40);
      subcategory.photoUri = photoUri;
    }

    await subcategory.save();

    res.status(200).json({
      message: "Подкатегория успешно обновлена.",
      subcategory,
    });
  } catch (error) {
    console.error("Ошибка при обновлении подкатегории:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function deleteSubcategory(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const subcategory = await Subcategory.findByIdAndDelete(id);
    if (!subcategory) {
      res.status(404).json({ error: "Подкатегория не найдена." });
      return;
    }

    res.status(200).json({
      message: "Подкатегория успешно удалена.",
    });
  } catch (error) {
    console.error("Ошибка при удалении подкатегории:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function getSubcategories(req: Request, res: Response) {
  try {
    const subcategories = await Subcategory.find();

    res.status(200).json({
      message: "Подкатегории успешно получены.",
      subcategories,
    });
  } catch (error) {
    console.error("Ошибка при получении подкатегорий:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function getSubcategoriesByCategory(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const subcategories = await Subcategory.find({ category: id });

    res.status(200).json({
      message: "Подкатегории успешно получены.",
      subcategories,
    });
  } catch (error) {
    console.error("Ошибка при получении подкатегорий по категории:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
