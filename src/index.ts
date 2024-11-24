import mongoose from "mongoose";
import express from "express"
import { mongodbUri, port } from "./config";
import { router } from "./routes/routes";

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
app.use("/api", router)

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});