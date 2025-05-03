import mongoose, { Model, model, Schema } from "mongoose";

const statusUpdateSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["placed", "packed", "dispatched", "out_for_delivery", "delivered", "return", "refund", "cancelled"],
      required: false
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const suborderSchema = new Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: false },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "store" },
    skuId: { type: String },
    size: { type: String, required: false },
    quantity: { type: Number, required: false },
    returnLastDate: { type: Date, required: false },
    mrp: { type: Number, required: false },
    finalPrice: { type: Number, required: false },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
    statusUpdates: [statusUpdateSchema],
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending"
    },
    delivery_status: {
      type: String,
      enum: ["In Transit", "Out for Delivery", "Delivered", "Lost"]
    }
  },
  {
    timestamps: true
  }
);

const SubOrder: Model<any> = model<any>("Suborder", suborderSchema);

export default SubOrder;
