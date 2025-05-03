import mongoose, { Model, model, Schema } from "mongoose";
import user from "./user.model";

export const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: user,
      required: false
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Suborder" }],
    payment: [
      {
        transactionId: {
          type: String,
          required: false
        },
        totalAmount: {
          type: Number,
          required: false
        },
        paymentDate: {
          type: Date,
          default: Date.now
        },
        status: {
          type: String,
          enum: ["pending", "success", "failed"]
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: false
    },
    coupon:{
         couponType:{
          enum: ["college", "school", "itsector","coupon"],
          type:String,
         },
         email:{
          type:String
         },
         studentId:{
          type:String
         },
         discount:{
          type:Number
         }
    },
    shippingAddress: {
      fullName: { type: String, required: false },
      PhoneNumber: { type: String, required: false },
      alternate_phone: { type: String, required: false },
      addressLine: { type: String, required: false },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String, required: false },
      state: { type: String, required: true },
      country: { type: String, required: false, default: "India" }
    },
    orderDate: {
      type: Date,
      default: Date.now
    },
    rateProduct: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "process"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

const Order: Model<any> = model<any>("order", orderSchema);

export default Order;
