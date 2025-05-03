import User from "../models/user.model";
import Seller from "../models/seller.model";
import Cart from "../models/cart.model";
import bcrypt from "bcrypt";
import { ILogin, IPasswordUpdate } from "../interfaces/login.interface";

export class LoginService {
  async login(data: ILogin) {
    if (data.userType === "customer") {
      if (!data.email || !data.password) {
        return { Login: "Unsuccessful", error: "Email and password are required" };
      }

      const user = await User.findOne({ email: data.email }).exec();
      if (!user) {
        return { Login: "Unsuccessful", error: "User not found" };
      }

      const passwordMatch = await bcrypt.compare(data.password, user.password);
      if (passwordMatch) {
        const cart = await Cart.findOne({ customerId: user._id });
        if (!cart) {
          const newCart = new Cart({
            customerId: user._id,
            items: []
          });

          await newCart.save();
        }
        return { Login: "Successful", UserData: user };
      } else {
        return { Login: "Unsuccessful", error: "Incorrect password! Try again" };
      }
    } else if (data.userType === "seller") {
      // Handle seller login logic here
    } else if (data.userType === "superAdmin") {
      // Handle superAdmin login logic here
    }
  }

  async passwordUpdate(data: IPasswordUpdate) {
    const user = await User.findOne({ _id: data.userId }).exec();
    const passwordMatch = await bcrypt.compare(data.old_password, user.password);
    if (passwordMatch) {
      user.password = data.new_password;
      const updatedUser = await user.save();
      return { Update: "Successful", UserData: updatedUser };
    } else {
      return { Update: "Unsuccessful", Comment: "Old Password does not match" };
    }
  }

  async checkLogin(userId: string) {
    const user = await User.findOne({ _id: userId }).exec();
    return { Login: "Successful", success: true, UserData: user };
  }
}
