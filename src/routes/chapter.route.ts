import { Router } from "express";
import checkAuth from "../utils/checkAuth";
import checkAdmin from "../utils/checkAdmin";
import {
  createChapter,
  deleteChapter,
  getChapters,
  updateChapter,
} from "../controllers/chapter.controller";

export const chapterRouter: Router = Router();

chapterRouter.post("/", checkAuth, checkAdmin, createChapter);
chapterRouter.get("/", checkAuth, getChapters);
chapterRouter.patch("/:id", checkAuth, checkAdmin, updateChapter);
chapterRouter.delete("/:id", checkAuth, checkAdmin, deleteChapter);
