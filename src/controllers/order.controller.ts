import { Request, Response } from "express";
import Product from "../models/product.model";
import User from "../models/user.model";
import Setting from "../models/setting.model";
import { getDistance } from "../utils/getDistance";
import Order from "../models/order.model";
import { OrderStatus } from "../types/order.type";
import mongoose from "mongoose";

export async function createOrderDetails(req: Request, res: Response) {
  const userId = req.user._id;
  const { products, selectedAddress } = req.body;

  if (!products || products.length === 0) {
    res.status(400).json({ error: "Пожалуйста, заполните все поля." });
    return;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        error: "Пользователь не найден.",
      });
      return;
    }

    if (user.address.length === 0) {
      res.status(400).json({
        error: "У вас нет ни одного адреса.",
      });
      return;
    }

    const settings = await Setting.findOne();
    if (!settings) {
      res.status(500).json({ error: "Не удалось получить настройки." });
      return;
    }

    const productIds = products.map(
      (product: { productId: string }) => product.productId
    );

    const productDetails = await Product.find({ _id: { $in: productIds } });

    if (productDetails.length !== products.length) {
      res
        .status(404)
        .json({ error: "Один или несколько продуктов не найдены." });
      return;
    }

    const clientAddressIndex = selectedAddress || 0;
    const clientAddress = user.address[clientAddressIndex];

    let orderAmount = 0;
    let totalWeight = 0;
    let totalDistance = 0;

    const orderProducts = products
      .map((product: { productId: string; quantity: number }) => {
        const productDetail = productDetails.find(
          (p) => p._id.toString() === product.productId
        );
        if (!productDetail) return null;

        const productTotalPrice = productDetail.price * product.quantity;
        const productTotalWeight = productDetail.weight * product.quantity;

        orderAmount += productTotalPrice;
        totalWeight += productDetail.weight * product.quantity;

        return {
          productId: productDetail._id,
          name: productDetail.name,
          quantity: product.quantity,
          price: productDetail.price,
          weight: productDetail.weight,
          totalPrice: productTotalPrice,
          totalWeight: productTotalWeight,
        };
      })
      .filter(Boolean);

    const distance = await getDistance(
      clientAddress.latitude,
      clientAddress.longitude,
      settings.lat,
      settings.lon
    );

    if (distance > settings.radius) {
      res.status(400).json({
        error: `Доставка за пределы радиуса(${settings.radius} км) невозможна.`,
      });
      return;
    }

    const deliveryAmount =
      distance * settings.pricePerKm +
      (totalWeight / 1000) * settings.pricePerKg;

    const total = orderAmount + deliveryAmount;

    res.status(200).json({
      message: "Детали заказа успешно получены",
      details: {
        products: orderProducts,
        weight: totalWeight,
        distance: distance,
        deliveryAmount,
        orderAmount,
        total,
      },
    });
  } catch (error) {
    console.error("Ошибка при вычислении деталей заказа:", error);
    res
      .status(500)
      .json({ error: "Ошибка при обработке запроса. Попробуйте снова." });
  }
}
export async function createOrder(req: Request, res: Response) {
  const userId = req.user._id;
  const { products, selectedAddress, comment } = req.body;

  if (!products || products.length === 0) {
    res.status(400).json({ error: "Пожалуйста, заполните все поля." });
    return;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        error: "Пользователь не найден.",
      });
      return;
    }

    if (user.address.length === 0) {
      res.status(400).json({
        error: "У вас нет ни одного адреса.",
      });
      return;
    }

    const settings = await Setting.findOne();
    if (!settings) {
      res.status(500).json({ error: "Не удалось получить настройки." });
      return;
    }

    const productIds = products.map(
      (product: { productId: string }) => product.productId
    );

    const productDetails = await Product.find({ _id: { $in: productIds } });

    if (productDetails.length !== products.length) {
      res
        .status(404)
        .json({ error: "Один или несколько продуктов не найдены." });
      return;
    }

    const clientAddressIndex = selectedAddress || 0;
    const clientAddress = user.address[clientAddressIndex];

    let orderAmount = 0;
    let totalWeight = 0;
    let totalDistance = 0;

    const orderProducts = products
      .map((product: { productId: string; quantity: number }) => {
        const productDetail = productDetails.find(
          (p) => p._id.toString() === product.productId
        );
        if (!productDetail) return null;

        const productTotalPrice = productDetail.price * product.quantity;
        const productTotalWeight = productDetail.weight * product.quantity;

        orderAmount += productTotalPrice;
        totalWeight += productDetail.weight * product.quantity;

        return {
          productId: productDetail._id,
          name: productDetail.name,
          photo: productDetail.photos[0],
          quantity: product.quantity,
          price: productDetail.price,
          weight: productDetail.weight,
          totalPrice: productTotalPrice,
          totalWeight: productTotalWeight,
        };
      })
      .filter(Boolean);

    const distance = await getDistance(
      clientAddress.latitude,
      clientAddress.longitude,
      settings.lat,
      settings.lon
    );

    if (distance > settings.radius) {
      res.status(400).json({
        error: `Доставка за пределы радиуса ${settings.radius} км невозможна.`,
      });
      return;
    }

    const deliveryAmount =
      distance * settings.pricePerKm +
      (totalWeight / 1000) * settings.pricePerKg;

    const total = orderAmount + deliveryAmount;

    const order = await Order.create({
      userId: user._id,
      userPhone: user.phone,
      address: clientAddress,
      products: orderProducts,
      weight: totalWeight,
      distance,
      deliveryAmount,
      orderAmount,
      total,
      comment,
    });

    res.status(200).json({
      message: "Заказ успешно создан",
      order,
    });
  } catch (error) {
    console.error("Ошибка при создание заказа:", error);
    res
      .status(500)
      .json({ error: "Ошибка при обработке запроса. Попробуйте снова." });
  }
}
export async function assignCourier(req: Request, res: Response) {
  const orderId = req.params.orderId;
  const { courierName, courierSurname, courierPhone } = req.body;

  if (!courierName || !courierSurname || !courierPhone) {
    res.status(400).json({ error: "Пожалуйста, заполните все поля." });
    return;
  }
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ error: "Заказ не найден." });
      return;
    }

    if (order.status !== OrderStatus.PENDING) {
      res.status(400).json({
        error: `Невозможно назначить курьера. Статус заказа: ${order.status}`,
      });
      return;
    }

    order.status = OrderStatus.COURIER_ASSIGNED;
    order.courierName = courierName;
    order.courierSurname = courierSurname;
    order.courierPhone = courierPhone;

    await order.save();

    res.status(200).json({
      message: "Курьер успешно назначин на заказ.",
      order,
    });
  } catch (error) {
    console.error("Ошибка при назначение курьера:", error);
    res
      .status(500)
      .json({ error: "Ошибка при обработке запроса. Попробуйте снова." });
  }
}
export async function getMyOrders(req: Request, res: Response) {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  try {
    const query: any = { userId };

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNumber)
      .select("address status date total track");

    res.status(200).json({
      message: "Заказы успешно получены",
      orders,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    console.error("Ошибка при получение заказов:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function getOrder(req: Request, res: Response) {
  const { _id: userId, isAdmin } = req.user;
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ error: "Заказ не найден." });
      return;
    }
    if (order.userId.toString() !== userId && !isAdmin) {
      res.status(403).json({ error: "У вас нет доступа к этому заказу." });
      return;
    }

    res.status(200).json({
      message: "Заказ успешно получен.",
      order,
    });
  } catch (error) {
    console.error("Ошибка при получение заказа:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function getOrders(req: Request, res: Response) {
  const {
    page = 1,
    limit = 10,
    track,
    startDate,
    endDate,
    productId,
    userId,
  } = req.query;
  const sortBy = req.query.sortBy as string;
  const order = req.query.order === "desc" ? -1 : 1;

  try {
    const query: any = {};
    if (track) {
      query.track = { $regex: track, $options: "i" };
    }

    if (productId) {
      query.products = {
        $elemMatch: {
          productId: new mongoose.Types.ObjectId(productId as string),
        },
      };
    }

    if (userId) {
      query.userId = userId;
    }

    if (startDate) {
      query.date = {
        $gte: startDate,
      };
    }

    if (endDate) {
      query.date = {
        ...query.date,
        $lte: endDate,
      };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limitNumber)
      .select("address status date total track");

    res.status(200).json({
      message: "Заказы успешно получены",
      orders,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    console.error("Ошибка при получение заказов:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
export async function changeOrderStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ error: "Заказ не найден." });
      return;
    }

    if (
      order.status !== OrderStatus.COURIER_ASSIGNED &&
      order.status !== OrderStatus.COURIER_PICKED_UP
    ) {
      res.status(400).json({
        error: "Нельзя изменить статус в этом этапе.",
      });
      return;
    }

    if (
      (order.status === OrderStatus.COURIER_ASSIGNED &&
        status !== OrderStatus.COURIER_PICKED_UP) ||
      (order.status === OrderStatus.COURIER_PICKED_UP &&
        status !== OrderStatus.DELIVERED)
    ) {
      res.status(400).json({
        error:
          "Невозможный переход статуса. Можно изменять статус только с 'Курьер назначен' на 'Курьер забрал' или с 'Курьер забрал' на 'Доставлен'.",
      });
      return;
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Статус заказа успешно изменен.",
      order,
    });
  } catch (error) {
    console.error("Ошибка при изменении статуса заказа:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
