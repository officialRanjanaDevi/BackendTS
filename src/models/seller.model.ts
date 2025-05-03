import { Model, model, Schema } from "mongoose";

export enum sellerStatus {
  active = "active",
  inactive = "inactive",
  pending = "pending"
}

export enum level {
  one = "1",
  two = "2",
  three = "3"
}

export enum roleType {
  seller = "seller",
  admin = "admin",
  storeManager = "storeManager",
  storeEmployee = "storeEmployee"
}

export const sellerDetails = new Schema({
  firstName: { type: String, required: true },
  middleName: {type: String},
  lastName: { type: String, required: true },
  email: { type: String, required: true , unique: true},
  phoneNumber: { type: String, required: true },
  alternatePhoneNumber: {type: String},
  
  password: { type: String, default: "00000000", required: true },
  access_level: { type: String, required: true, enum:   Object.values(level), default: level.one },
  role: { type: String, required: true, enum: Object.values(roleType), default: roleType.seller },
  profilePic: {
    filename: { type: String, required: false },
    url: { type: String, required: false }
  },
  status: { type: String, enum: Object.values(sellerStatus), default: sellerStatus.active },
  language: [{ type: String, required: false }],
  documentVerification: {
    status: { type: String, enum: Object.values(sellerStatus), default: sellerStatus.inactive },
    documents: [
      {
        name: { type: String, required: false },
        url: { type: String, required: false }
      }
    ]
  }
});

const Seller: Model<any> = model<any>("seller", sellerDetails);
export default Seller;
