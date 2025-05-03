import { string } from "joi";

export interface ISeller extends Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  pincode: string;
  address1: string;
  address2?: string;
  country: string;
  state: string;
  district: string;
  profilePic?: string;
  language?: string[];
}

export interface ISellerUpdate {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  profilePic?: string;
  language?: string[];
}
