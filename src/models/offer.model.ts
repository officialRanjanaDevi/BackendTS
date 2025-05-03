import { Model, model, Schema } from "mongoose";

export interface Offer {
  title: string;
  description: string;
  discount: number;
  applicableProducts: Array<Schema.Types.ObjectId>; // Array of product IDs on which the offer will be applicable
  createdAt: Date;
  updatedAt: Date;
  validFrom: Date;
  validUntil: Date;
}

const offerSchema: Schema<Offer> = new Schema<Offer>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    discount: { type: Number, required: true },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "product", required: false }],
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
  },
  { timestamps: true }
);

const OfferModel: Model<Offer> = model<Offer>("Offer", offerSchema);

export default OfferModel;
