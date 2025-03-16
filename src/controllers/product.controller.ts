import { Request, Response } from "express";
import Subcategory from "../models/subcategory.model";
import { compressImage } from "../utils/compressImage";
import Product from "../models/product.model";
import Category from "../models/category.model";
import { unlinkSync } from "fs";
import Chapter from "../models/chapter.model";

export async function createProduct(req: Request, res: Response) {
  const {
    name,
    description,
    categoryId,
    subcategoryId,
    deliveryTime,
    weight,
    price,
    chapterId,
  } = req.body;

  if (
    !name ||
    !description ||
    !categoryId ||
    !subcategoryId ||
    !deliveryTime ||
    !weight ||
    !price ||
    !chapterId
  ) {
    res.status(400).json({ error: "Пожалуйста заполните все поля." });
    return;
  }

  if (price <= 0 || weight <= 0 || deliveryTime <= 0) {
    res.status(400).json({ error: "Пожалуйста введите корректные данные." });
    return;
  }

  if (!req.files || !Array.isArray(req.files) || req.files.length <= 0) {
    res
      .status(400)
      .json({ error: "Пожалуйста предоставьте хотя бы одно фото." });
    return;
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404).json({ error: "Категория не найдена." });
      return;
    }

    const subcategory = await Subcategory.findOne({
      _id: subcategoryId,
      category: categoryId,
    });
    if (!subcategory) {
      res.status(404).json({ error: "Подкатегория не найдена." });
      return;
    }

    const chapter = await Chapter.findOne({
      _id: chapterId,
      category: categoryId,
      subcategory: subcategoryId,
    });
    if (!chapter) {
      res.status(404).json({ error: "Раздел не найдена." });
      return;
    }

    let photos: string[] = [];

    const files = req.files.map(async (file: Express.Multer.File) => {
      try {
        const compressedFile = await compressImage(
          file.path,
          "uploads/products",
          1000,
          800
        );
        return compressedFile;
      } catch (error) {
        console.error("Ошибка при сжатии изображения:", error);
        unlinkSync(file.path);
        throw new Error("Ошибка при сжатии изображения.");
      }
    });

    photos = await Promise.all(files);

    const product = await Product.create({
      name,
      description,
      categoryId: category._id,
      categoryName: category.name,
      subcategoryId: subcategory._id,
      subcategoryName: subcategory.name,
      deliveryTime,
      weight,
      price,
      photos,
      chapterId: chapter._id,
      chapterName: chapter.name,
    });

    res.status(201).json({
      message: "Продукт успешно создан.",
      product,
    });
  } catch (error) {
    console.error("Ошибка при добавлении продукта:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  const {
    name,
    description,
    categoryId,
    subcategoryId,
    deliveryTime,
    weight,
    price,
    oldPhotos,
    chapterId,
  } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: "Продукт не найден." });
      return;
    }

    let category = null;
    if (categoryId) {
      category = await Category.findById(categoryId);
      if (!category) {
        res.status(404).json({ error: "Категория не найдена." });
        return;
      }
    }

    let subcategory = null;
    if (subcategoryId) {
      subcategory = await Subcategory.findOne({
        _id: subcategoryId,
        category: categoryId,
      });
      if (!subcategory) {
        res.status(404).json({
          error:
            "Подкатегория не найдена или не привязана к указанной категории.",
        });
        return;
      }
    }

    let chapter = null;
    if (chapterId) {
      chapter = await Chapter.findOne({
        _id: chapterId,
        category: categoryId,
        subcategory: subcategoryId,
      });
      if (!chapter) {
        res.status(404).json({ error: "Раздел не найден." });
        return;
      }
    }

    product.chapterId = chapterId || product.chapterId;
    product.name = name || product.name;
    product.description = description || product.description;
    product.categoryId = categoryId || product.categoryId;
    product.categoryName = category ? category.name : product.categoryName;
    product.subcategoryId = subcategoryId || product.subcategoryId;
    product.subcategoryName = subcategory
      ? subcategory.name
      : product.subcategoryName;
    product.deliveryTime = deliveryTime || product.deliveryTime;
    product.weight = weight || product.weight;
    product.price = price || product.price;

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      let newPhotos: string[] = [];
      const files = req.files.map(async (file: Express.Multer.File) => {
        try {
          const compressedFile = await compressImage(
            file.path,
            "uploads/products",
            1000,
            800
          );
          return compressedFile;
        } catch (error) {
          console.error("Ошибка при сжатии изображения:", error);
          unlinkSync(file.path);
          throw new Error("Ошибка при сжатии изображения.");
        }
      });

      newPhotos = await Promise.all(files);
      if (oldPhotos) {
        product.photos = [...newPhotos, oldPhotos];
      } else {
        product.photos = newPhotos;
      }
    }

    await product.save();

    res.status(200).json({
      message: "Продукт успешно обновлен.",
      product,
    });
  } catch (error) {
    console.error("Ошибка при обновлении продукта:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404).json({ error: "Продукт не найден." });
      return;
    }

    res.status(200).json({
      message: "Продукт успешно удален.",
    });
  } catch (error) {
    console.error("Ошибка при удаление продукта:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function getProducts(req: Request, res: Response) {
  const {
    page = 1,
    limit = 10,
    categoryId,
    subcategoryId,
    chapterId,
    startDate,
    endDate,
    search,
  } = req.query;
  const sortBy = (req.query.sortBy as string) || "date";
  const order = req.query.order === "desc" ? -1 : 1;
  try {
    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (subcategoryId) {
      query.subcategoryId = subcategoryId;
    }

    if (chapterId) {
      query.subcategoryId = subcategoryId;
    }

    if (startDate) {
      query.date = {
        $gte: startDate,
      };
    }

    if (endDate) {
      query.date = {
        $lte: endDate,
      };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ [sortBy]: order })
      .select("price photos name")
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      message: "Продукты успешно получены",
      products,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    console.error("Ошибка при получение продуктов:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function getProduct(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: "Продукт не найден." });
      return;
    }

    res.status(200).json({
      message: "Продукт успешно получен.",
      product,
    });
  } catch (error) {
    console.error("Ошибка при получение продукта:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function getSimilarProducts(req: Request, res: Response) {
  const { id } = req.params;
  const { limit = 12 } = req.query;
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: "Продукт не найден." });
      return;
    }

    const titleWords = product.name
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 2 &&
          !["с", "и", "на", "в", "по"].includes(word.toLowerCase())
      )
      .map((word) => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));

    const titleRegex = new RegExp(titleWords.join("|"), "i");

    const products = await Product.find({
      _id: { $ne: id },
      $or: [{ name: { $regex: titleRegex } }],
    }).limit(Number(limit));

    res.status(200).json({
      messsage: "Похожие товары успешно получены",
      products,
    });
  } catch (error) {
    console.error("Ошибка при получение похожих продуктов:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function getProductsBySubcategoryId(req: Request, res: Response) {
  const { subcategoryId } = req.params;

  try {
    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      res.status(404).json({ error: "Подкатегория не найдена." });
      return;
    }

    const products = await Product.find({ subcategoryId })
      .populate("categoryId", "name")
      .populate("subcategoryId", "name")
      .populate("chapterId", "name");

    const groupedProducts = products.reduce((groups: any, product: any) => {
      const chapterId = product.chapterId
        ? product.chapterId._id
        : "uncategorized";

      if (!groups[chapterId]) {
        groups[chapterId] = {
          chapterId,
          chapterName: product.chapterId
            ? product.chapterId.name
            : "Без раздела",
          products: [],
        };
      }

      groups[chapterId].products.push(product);
      return groups;
    }, {});

    const result = Object.values(groupedProducts);

    res.status(200).json(result);
  } catch (error) {
    console.error("Ошибка при получении продуктов по подкатегории:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
