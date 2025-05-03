import { Model, model, Schema, Document } from "mongoose";

export enum CommissionStatus {
  ACTIVE = "active",
  INACTIVE = "inactive"
}

export interface IProductCommission extends Document {
  productId: string;
  commission: number;
  datedFrom: Date;
  datedTo: Date;
  status: CommissionStatus;
}

const productCommissionSchema: Schema = new Schema({
  productId: { type: String, required: true },
  commission: { type: Number, required: true },
  datedFrom: { type: Date, required: true },
  datedTo: { type: Date, required: true },
  status: { type: String, required: true, enum: Object.values(CommissionStatus), default: CommissionStatus.ACTIVE }
});

const ProductCommission: Model<IProductCommission> = model<IProductCommission>("productCommission", productCommissionSchema);
export default ProductCommission;
