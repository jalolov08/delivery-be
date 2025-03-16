import { Request, Response } from "express";
import Subcategory from "../models/subcategory.model";
import Chapter from "../models/chapter.model";
import { Types } from "mongoose";

export async function createChapter(req: Request, res: Response) {
  const { subcategoryId, name } = req.body;

  if (!name || !subcategoryId) {
    res.status(400).json({ error: "Пожалуйста заполните поля." });
    return;
  }

  try {
    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      res.status(404).json({ error: "Подкатегория не найдена." });
      return;
    }

    const chapter = await Chapter.create({
      name,
      subcategory,
      category: subcategory.category,
    });

    res.status(201).json({
      message: "Раздел успешно создан.",
      chapter,
    });
  } catch (error) {}
}
export async function getChapters(req: Request, res: Response) {
  const { subcategoryId, category, name } = req.query;

  try {
    let filters: any = {};

    if (subcategoryId) filters.subcategory = subcategoryId;
    if (category) filters.category = category;
    if (name) filters.name = new RegExp(name as string, "i");

    const chapters = await Chapter.find(filters).populate(
      "subcategory",
      "name"
    );

    if (chapters.length === 0) {
      res.status(404).json({ error: "Частей не найдено." });
      return;
    }

    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении разделов." });
  }
}
export async function updateChapter(req: Request, res: Response) {
  const { id } = req.params;
  const { name, subcategoryId } = req.body;

  try {
    const chapter = await Chapter.findById(id);

    if (!chapter) {
      res.status(404).json({ error: "Раздел не найден." });
      return;
    }

    if (name) chapter.name = name;
    if (subcategoryId) {
      const subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) {
        res.status(404).json({ error: "Подкатегория не найдена." });
        return;
      }
      chapter.subcategory = new Types.ObjectId(subcategory._id as string);
      chapter.category = subcategory.category;
    }

    await chapter.save();
    res.status(200).json({
      message: "Раздел успешно обновлен.",
      chapter,
    });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обновлении раздела." });
  }
}
export async function deleteChapter(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const chapter = await Chapter.findById(id);

    if (!chapter) {
      res.status(404).json({ error: "Раздел не найден." });
      return;
    }

    await chapter.deleteOne();
    res.status(200).json({ message: "Раздел успешно удален." });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при удалении раздела." });
  }
}
