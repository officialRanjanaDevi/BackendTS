import { string } from "joi";

export interface IPasswordUpdate {
  userId: string;
  old_password: string;
  new_password: string;
}

export interface ILogin extends Document {
  email: string;
  password: string;
  userType: string;
}
