import { NextFunction, Request, Response } from "express";
import { UserService } from "./../../services/user.service";
import Cart from "../../models/cart.model";
// import { userAdd, userCreation, userUpdate } from "./../../validation/user.schema";
import User from "../../models/user.model";
// import { Reject } from "twilio/lib/twiml/VoiceResponse";
// import Address from "../../models/address.model";

/**
 * *Controller class for handling user-related operations.
 */
export class UserController {
  // @validateRequestBody(userCreation)
  /**
   * *Creates a new user and adds them to the database.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the user is created.
   * @throws {Error} - If there is an error creating the user.
   */
  static async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result: any = await new UserService().create({ ...request.body }, language);
      if (result)
        response.status(201).json(result);
      else
        response.status(400).json({ message: "User can't be created!" });

    } catch (err) {
      //Handle any error and pass to the next middleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  // @validateRequestBody(userAdd)
  /**
   * *Adds a new user to the system.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next function to call in the middleware chain.
   * @returns {Promise<void>} - A promise that resolves when the user is added successfully.
   * @throws {Error} - If there is an error during the user creation process.
   */
  static async add(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const user = await User.find({ email: request.body.email });
      if (user) {
        response.status(401).json({ message: "email already exist" });
      } else {
        const result: any = await new UserService().create({ ...request.body }, language);
        const userCart = {
          customerId: result._id,
          items: [],
          document: []
        };
        await Cart.create(userCart);
        response.status(201).json(result);
      }
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Retrieves all users from the UserService based on the provided request parameters.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   * @throws {Error} - If an error occurs during the operation.
   */
  static async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      //Destructure limit and page number from request
      const { limit = "0", page = "1" } = request.query;
      // Parse them to integers
      const l = parseInt(limit.toString());
      const p = parseInt(page.toString());

      // Call the UserService's getAll method
      const result = await new UserService().getAll(l, p);

      // Send the response with status code 200 and the result
      response.status(200).json({ page: Number(page) ?? 0, limit: Number(limit) ?? 0, data: result });
    } catch (err) {
      // Pass the error to the next middleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Retrieves a single user based on the provided ID
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the user is retrieved and the response is sent.
   * @throws {Error} - If an error occurs during the retrieval process.
   */
  static async getOne(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      // Call the UserService's getOne method passing the userId from request params
      const result = await new UserService().getOne(request.params._id, language);
      // Send the response with status code 200 and the result
      response.status(200).json(result);
    } catch (err) {
      // Pass the error to the next middleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  // @validateRequestBody(userUpdate)
  /**
   * *Updates a user's information based on the provided request parameters and body.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next function to call in the middleware chain.
   * @returns {Promise<void>} - A promise that resolves when the update is complete.
   * @throws {Error} - If an error occurs during the update process.
   */
  static async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      // Call the UserService's updateOne method passing the userId from request params and body
      const result = await new UserService().updateOne(request.params._id, request.body, language);
      // Send the response with status code 202 and the result
      response.status(202).json(result);
    } catch (err) {
      // Pass the error to the next middleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Deletes a user based on the provided ID.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the user is deleted.
   * @throws {Error} - If there is an error during the deletion process.
   */
  static async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      // Call the UserService's delete method passing the userId from request params
      const result = await new UserService().delete(request.params._id, language);
      // Send the response with status code 202 and the result
      response.status(202).json(result);
    } catch (err) {
      // Pass the error to the next middleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Revoke a user based on the provided  user ID.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the user's access is revoked.
   * @throws {Error} - If an error occurs during the revocation process.
   */
  static async revoke(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      // Call the UserService's revoke method passing the userId from request params
      const result = await new UserService().revoke(request.params._id, language);
      // Send the response with status code 202 and the result
      response.status(202).json(result);
    } catch (err) {
      //Pass the error to the next middleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Handles the upload of user Profile picture from a request and stores it in the user's collection.
   * @param {Request} request - The request object.
   * @param {Response} response - The response object.
   * @param {NextFunction} next - The next function to call in the middleware chain.
   * @returns {Promise<void>} - A promise that resolves when the file is uploaded and stored successfully.
   * @throws {Error} - If there is an error during the upload process.
   */
  static async uploadFile(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Check if a file was uploaded
      if (request.file === undefined) response.json("you must select a file.");

      // Create an image object
      const file = request.file;
      const image = {
        filename: file.filename,
        url: file.path
      };

      // Call the UserService's uploadImage method passing the userId from request params and image to save the image details in user's collection
      const result = await new UserService().uploadImage(request.params.userId, image);
      // Send the response with status code 202 and the result
      response.status(202).json({ comment: "File stored successfully", newFile: image, data: result });
    } catch (err) {
      // Pass the error to the next middleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Adds a product to the user's wishlist.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the wishlist is successfully updated.
   * @throws {Error} - If there is an error adding the product to the wishlist.
   */
  static async addWishList(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      // Call the UserService's addWishList method passing the userId from request params and productId from request params
      const result: any = await UserService.addWishList(request.params.userId, request.params.productId, language);
      // Send the response with status code 201 and the result
      response.status(201).json(result);
    } catch (err) {
      // Pass the error to the next middleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Deletes a product from a user's wishlist.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the wishlist is successfully deleted.
   * @throws {Error} - If there is an error during the deletion process.
   */
  static async deleteWishList(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      // Call the UserService's deleteWishList method passing the userId from request params and productId from request params
      const result = await UserService.deleteWishList(request.params.userId, request.params.productId, language);
      // Send the response with status code 202 and the result
      response.status(202).json(result);
    } catch (err) {
      // Pass the error to the next middleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}