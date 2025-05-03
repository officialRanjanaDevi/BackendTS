import { IUser, IUserUpdate } from "../interfaces/user.interface";
import { PaymentMethod } from "../interfaces/user.interface";
import User from "../models/user.model";
import Address from "../models/address.model";
import bcrypt from "bcrypt";
import Cart from "../models/cart.model";

/**
 * *A service class for managing user-related operations.
 */
export class UserService {
  /**
   * Creates a new user with the given data and saves it to the database.
   * @param {IUser} data - The user data object.
   * @param {string} [language] - The language of the user.
   * @returns {Promise<User>} A promise that resolves to the saved user object.
   */
  async create(data: IUser, language?: string) {

    if (!data.email)
      return { Error: "Email not found!" }
    if (!data.name)
      return { Error: "Name not found!" }
    if (!data.password)
      return { Error: "Please provide password!" }

    //search in database if user with given email exixts
    const userExists = await User.findOne({ email: data.email });

    if (userExists) {
      //if user with same email exists responde with error message
      return { message: "Email already exist" };
    }

    if (data.paymentDetails) {
      if (data.paymentDetails.paymentMethod === "card") data.paymentDetails.paymentMethod = PaymentMethod.card;
      if (data.paymentDetails.paymentMethod === "upi") data.paymentDetails.paymentMethod = PaymentMethod.upi;
      if (data.paymentDetails.paymentMethod === "netbanking") data.paymentDetails.paymentMethod = PaymentMethod.netbanking;
      if (data.paymentDetails.paymentMethod === "paypal") data.paymentDetails.paymentMethod = PaymentMethod.paypal;
      if (!data.paymentDetails.paymentMethod) data.paymentDetails.paymentMethod = PaymentMethod.default;
    }
    // Hash the password
    const saltRounds = 10; // Adjust this according to your security requirements
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Create a new user with the hashed password
    const user = new User({
      ...data,
      password: hashedPassword,
      phone_number: "",
      accessLevel: 1
    });

    //initialize an empty cart for the user
    const userCart = {
      customerId: user._id,
      items: [],
      document: []
    };
    //save cart in database
    await Cart.create(userCart);
    // Save the user to the database
    return user.save();
  }

  /**
   * *Retrieves a list of users with optional pagination and language filtering.
   * @param {number} limit - The maximum number of users to retrieve.
   * @param {number} page - The page number of the results to retrieve.
   * @param {string} [language] - Optional language filter for the users.
   * @returns {Promise<Array<Object>>} - A promise that resolves to an array of user objects with their address details.
   */
  async getAll(limit: number, page: number, language?: string) {
    const users = await User.find()
      .limit(limit)
      .skip(page * limit)
      .lean()
      .exec();

    // Fetch address details for all users in parallel
    const userIds = users.map((user) => user._id);
    const addressDetails = await Address.find({ refId: { $in: userIds } }).exec();

    // Create a map of user IDs to address details for efficient lookup
    const addressMap = new Map();
    addressDetails.forEach((address) => {
      addressMap.set(address.refId.toString(), address);
    });

    // Merge user and address details
    const result = users.map((user) => {
      const address = addressMap.get(user._id.toString());
      return {
        ...user,
        addressDetails: address || null // Handle cases where address is not found
      };
    });

    // Return the result
    return result;
  }

  /**
   * *Retrieves a user and their associated address details from the database.
   * @param {string} userId - The ID of the user to retrieve.
   * @param {string} [language] - The language of the user.
   * @returns {Promise<User>} A promise that resolves to the user object with their address details.
   */
  async getOne(userId: string, language?: string) {
    // Fetch user and address details
    const [user, address] = await Promise.all([User.findOne({ _id: userId }).exec(), Address.findOne({ refId: userId }).exec()]);

    if (user) {
      user.addressDetails = address || null; // Handle cases where address is not found
    }
    // Return the user
    return user;
  }

  /**
   * *Updates a user's information in the database.
   * @param {string} userId - The ID of the user to update.
   * @param {IUserUpdate} body - The updated user information.
   * @param {string} [language] - The language of the user.
   * @returns An object containing the updated user data and address details.
   * @throws Error if password hashing fails.
   */
  async updateOne(userId: string, body: IUserUpdate, language?: string) {
    let updatedFields: any = {};

    if (body.name) updatedFields.name = body.name;
    if (body.phone_number) updatedFields.phone_number = body.phone_number;
    if (body.dateOfBirth) updatedFields.dateOfBirth = body.dateOfBirth;
    if (body.gender) updatedFields.gender = body.gender;

    if (body.password) {
      const saltRounds = 10; // Adjust this according to your security requirements
      const hashedPassword = await bcrypt.hash(body.password, saltRounds).catch((err) => {
        throw new Error("Password hashing failed: " + err.message);
      });
      updatedFields.password = hashedPassword;
    }

    // Update the user document
    const userUpdateResult = await User.findByIdAndUpdate(userId, updatedFields, { new: true }).exec();
    // console.log(userUpdateResult)
    // Return the updated user
    return userUpdateResult;
  }

  /**
   * Deletes a user with the specified userId and updates their status to "inactive".
   * @param {string} userId - The ID of the user to delete.
   * @param {string} [language] - The language of the user.
   * @returns {Promise<User>} A promise that resolves to the updated user object.
   */
  async delete(userId: string, language?: string) {
    // Set the status of the user to "inactive"
    const result = await User.findOneAndUpdate({ _id: userId }, { $set: { status: "inactive" } }, { new: true }).exec();
    return result;
  }

  /**
   * Revoke a user by their ID.
   * @param {string} userId - The ID of the user to revoke.
   * @param {string} [language] - The language of the user.
   * @returns {Promise<void>} - A promise that resolves when the user is revoked.
   */
  async revoke(userId: string, language?: string) {
    // Remove the user from the database
    return await User.findByIdAndRemove({ _id: userId }).exec();
  }

  /**
   * Uploads an image and updates the profile picture of a user.
   * @param {string} userId - The ID of the user.
   * @param {any} image - The image to upload.
   * @returns {Promise<any>} - A promise that resolves to the updated user object.
   */
  async uploadImage(userId: string, image: any) {
    // Update the user image
    return await User.findByIdAndUpdate(userId, { profilePic: image }, { new: true }).exec();
  }

  /**
   * Updates the password for a user with the given user ID.
   * @param {string} userId - The ID of the user to update the password for.
   * @param {string} newPassword - The new password to set for the user.
   * @returns None
   */
  async updatePassword(userId: string, newPassword: string) {
    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    // Update the password in the database
    await User.updateOne({ _id: userId }, { password: hashedPassword });
  }

  /**
   * Adds a product to the wishlist of a user.
   * @param {string} userId - The ID of the user.
   * @param {string} productId - The ID of the product to add to the wishlist.
   * @param {string} [language] - The language of the user.
   * @returns {Promise<User>} A promise that resolves to the updated user object with the added product in the wishlist.
   */
  static async addWishList(userId: string, productId: string, language?: string) {
    // Add the product to the user's wish list
    const add = await User.findOneAndUpdate({ _id: userId }, { $push: { wishList: productId } }, { new: true }).exec();
    // Return the updated user
    return add;
  }

  /**
   * Deletes a product from a user's wish list.
   * @param {string} userId - The ID of the user.
   * @param {string} productId - The ID of the product to be deleted.
   * @param {string} [language] - The language of the user.
   * @returns {Promise<object>} - A promise that resolves to the updated user object.
   */
  static async deleteWishList(userId: string, productId: string, language?: string) {
    // Delete the product from the user's wish list
    const result = await User.findOneAndUpdate({ _id: userId }, { $pull: { wishList: productId } }, { new: true }).exec();
    return result;
  }
}