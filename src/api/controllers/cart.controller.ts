import { NextFunction, Request, Response } from "express";
import { CartService } from "../../services/cart.service";
import Product from "../../models/product.model";
import Cart from "../../models/cart.model";

export class CartController {
  static async getCart(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result = await new CartService().getCart(request.params.customerId, language);
      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async addItem(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const { productId, customerId, count, size } = request.body;
      console.log(request.body);
      const result = await new CartService().addItem(productId, customerId, language, count, size);
      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async updateCartAddress(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { customerId } = request.params;
      console.log(customerId);
      const result = await new CartService().updateCartAddress(customerId, request.body);
      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async deleteItem(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = request.user.id;
      const { productId } = request.params;
      const result = await new CartService().deleteItem(customerId, productId);
      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async removeProduct(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = request.user.id;
      const { productId } = request.params;
      const result = await new CartService().removeProduct(customerId, productId);
      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async updateCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { customerId } = req.params;
    const { items } = req.body;

    try {
      let cart = await Cart.findOne({ customerId });
      if (!cart) {
        throw new Error("No Cart Found For User");
      }

      for (const item of items) {
        const { productId, count } = item;

        const product = await Product.findById(productId._id);
        if (!product) {
          throw new Error(`Product with ID ${productId._id} not found`);
        }

        // Check if the item already exists in the cart's items array
        const existingItemIndex = cart.items.findIndex((cartItem) => cartItem.productId.toString() === productId._id);

        if (existingItemIndex !== -1) {
          // If item exists, update the count
          cart.items[existingItemIndex].count = count;
        } else {
          throw Error("Something Went Wrong");
        }
      }

      const updatedCart = await cart.save();

      res.status(200).json(updatedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
