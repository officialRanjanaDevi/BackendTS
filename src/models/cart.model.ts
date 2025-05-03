import mongoose, { Model, model, Schema } from "mongoose";
import Product from "./product.model";

export enum level {
  one = "1",
  two = "2",
  three = "3"
}

export enum productCount {
  one = 1,
  two = 2,
  three = 3,
  four = 4,
  five = 5
}

export const cartDetails = new Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "address" },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: false
      },
      count: {
        type: Number,
        required: false,
        default: 1
      },
      size: {
        type: String,
        required: false
      }
    }
  ]
});

const Cart: Model<any> = model<any>("cart", cartDetails);
export default Cart;
