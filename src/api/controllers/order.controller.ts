import { NextFunction, Request, Response } from "express";
import { OrderService } from "../../services/order.service";
import Product from "../../models/product.model";
import Order from "../../models/order.model";
import Razorpay from "razorpay";
import SubOrder from "../../models/suborder.model";

export class OrderController {
  static async create(request, response, next) {
    try {
      // console.log("Raw Request Body:", request.body);
      const { userId } = request.params;
      const orderData = request.body;

      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });

      const orderResult = await new OrderService().createOrder({ userId, ...orderData });

      const options = {
        amount: orderData.totalPrice * 100,
        currency: orderData.currency,
        receipt: orderResult?.newOrder?._id
      };

      const razorpayResponse = await razorpay.orders.create(options);
      console.log("Razorpay Response:", razorpayResponse);
      response.status(201).json({
        ...orderResult,
        razorpayResponse
      });
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getMyOrder(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = "0", page = "1" } = request.query;
      const l = parseInt(limit.toString());
      const p = parseInt(page.toString());

      // console.log("Fetching orders for userId:", request.params.userId);

      const result = await new OrderService().myOrders(request.params.userId, l, p);
      // console.log("Result:", result);
      const orders: any = await new OrderService().myOrders(request.params.userId, 0, 0);
      response.status(200).json({ totalCount: orders.length, page: Number(page) ?? 0, limit: Number(limit) ?? 0, data: result, totalOrders: orders });
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = "0", page = "1" } = request.query;
      const l = parseInt(limit.toString());
      const p = parseInt(page.toString());
      const result = await new OrderService().getAllOrders(l, p);
      const orders: any = await new OrderService().getAllOrders(0, 0);
      response.status(200).json({ totalCount: orders.length, page: Number(page) ?? 0, limit: Number(limit) ?? 0, data: result, totalUsers: orders });
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async updateStock(productId: string, quantity: number) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }

  static async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = request.params._id;
      console.log("orderId", orderId);
      const updatedData = request.body;

      const result = await new OrderService().updateOrder(orderId, updatedData);
      response.json(result);
    } catch (err) {
      console.error("Error:", err);
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async updateSubOrder(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = request.params._id;
      console.log("orderId", orderId);
      const updatedData = request.body;

      const result = await new OrderService().updateSubOrder(orderId, updatedData);
      response.json(result);
    } catch (err) {
      console.error("Error:", err);
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = request.params.id; // Extract orderId from URL

      // Call the deleteOrder function in the OrderService
      const result = await new OrderService().deleteOrder(orderId);
      response.json(result);
    } catch (err) {
      console.error("Error:", err);
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  static async getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { _id } = req.params;
    try {
      const order = await Order.findById({ _id }).populate({
        path: "products",
        populate: { path: "productId" }
      });
      res.json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getSubOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { _id } = req.params;
    try {
      const order = await SubOrder.findById({ _id }).populate("productId");
      res.json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
