import mongoose from "mongoose";
import express from "express";
import { mongodbUri, port } from "./config";
import { router } from "./routes/routes";
import cors from "cors";
import * as admin from "firebase-admin";

const serviceAccount =
  require("./fcm/delivery-44c6d-firebase-adminsdk-ebwqm-0c424d2409.json") as admin.ServiceAccount;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
app.use(cors());
app.use("/api/uploads", express.static("uploads"));
app.use("/api", router);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
