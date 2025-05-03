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

export const liveDemoDetails = new Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
      required: false
    }
  ],
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date }
});

const LiveDemo: Model<any> = model<any>("liveDemo", liveDemoDetails);
export default LiveDemo;
