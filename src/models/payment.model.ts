import mongoose, { Model, model, Schema, Document } from "mongoose";

export enum PaymentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive"
}

export interface IPayment extends Document {
  storeId: string;
  totalItems: number;
  balance: number;
  totalRevenue: number;
  status: PaymentStatus;
}

const paymentSchema: Schema = new Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, required: false },
  totalItems: { type: Number, required: false },
  balance: { type: Number, required: false },
  totalRevenue: { type: Number, required: false },
  status: {
    type: String,
    required: false,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.ACTIVE
  },
  suborderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suborder",
    required: false
  },
  finalPrice: {
    type: Number,
    required: false
  },
  sgst: {
    type: Number,
    required: false
  },
  cgst: {
    type: Number,
    required: false
  }
});

const PaymentModel: Model<IPayment> = model<IPayment>("Payment", paymentSchema);
export default PaymentModel;
