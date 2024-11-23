import mongoose from "mongoose";
import express from "express"
import { mongodbUri, port } from "./config";

mongoose
    .connect(mongodbUri, {})
    .then(() => {
        console.log("Успешно подключено к MongoDB");
    })
    .catch((error) => {
        console.error("Ошибка при подключение к MongoDB:", error);
    });

const app = express();
app.use(express.json());


app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});