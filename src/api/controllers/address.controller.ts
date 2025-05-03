import { NextFunction, Request, Response } from "express";
import { AddressService } from "../../services/address.service";
// import { guard } from "../../middlewares/jwt-gaurd.middleware";
import { addressType, refType } from "../../models/address.model";

/**
 * *Controller class for handling address-related operations.
 */
export class AddressController {
  // @validateRequestBody(addressCreation)

  /**
   * *Creates a new address using the provided request data.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next function to call in the middleware chain.
   * @returns {Promise<void>} - A promise that resolves when the address is created.
   * @throws {Error} - If there is an error creating the address.
   */
  static async createAddress(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      // Create a new address using the AddressService
      const result: any = await new AddressService().createAddress({ ...request.body }, language);
      // Respond with the created address and a status code of 201 (Created).
      response.status(201).json(result);
    } catch (err) {
      // Handle any errors, parse them, and pass them to the next middleware.
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Retrieves all addresses with pagination.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   * @throws {Error} - If an error occurs during the operation.
   */
  static async getAllAddress(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Extract limit and page from request query
      const { limit = "10", page = "1" } = request.query;
      const l = parseInt(limit.toString());
      const p = parseInt(page.toString());

      // Fetch addresses
      const result = await new AddressService().getAllAddress(l, p);

      // Fetch all addresses using the AddressService
      const addresses = await new AddressService().getAllAddress(0, 0);

      // Prepare response
      response.status(200).json({
        totalCount: addresses.length,
        page: Number(page) ?? 0,
        limit: Number(limit) ?? 0,
        data: result,
        totalAddresses: addresses
      });
    } catch (err) {
      // Handle error
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({
        code: error.code,
        message: error.message,
        error: error.error
      });
    }
  }

  /**
   * *Retrieves an address based on the provided reference ID and address type.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves to nothing.
   * @throws {Error} - If an error occurs during the address retrieval process.
   */
  static async getAddress(request: Request, response: Response, next: NextFunction): Promise<void> {
    const type: refType = request.params.type as refType;
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      //Fetch address using the provided reference ID and address type
      const result = await new AddressService().getAddress(request.params.refId, type, language);
      // Respond with the fetched address and a status code of 200 (OK).
      response.status(200).json(result);
    } catch (err) {
      // Handle any errors, parse them, and pass them to the next middleware.
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  // @validateRequestBody(addressUpdate)
  /**
   * *Updates an address based on the provided request parameters and body.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the address is updated.
   * @throws {Error} - If an error occurs during the update process.
   */
  static async updateAddress(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";

      //Call the AddressService to update the address
      const result = await new AddressService().updateOneAddress(request.params._id, request.body, language);
      // Respond with the updated address and a status code of 202 (Accepted).
      response.status(202).json(result);
    } catch (err) {
      // Handle any errors, parse them, and pass them to the next middleware.
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Deletes an address based on the provided ID.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the address is deleted.
   * @throws {Error} - If an error occurs during the deletion process.
   */
  static async deleteAddress(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      //Call the AddressService to delete the address
      const result = await new AddressService().deleteAddress(request.params._id, language);
      // Respond with the deleted address and a status code of 202 (Accepted).
      response.status(202).json(result);
    } catch (err) {
      // Handle any errors, parse them, and pass them to the next middleware.
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Revoke an address by its ID.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the address is revoked.
   * @throws {Error} - If an error occurs during the revocation process.
   */
  static async revokeAddress(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      //Call the AddressService to revoke the address
      const result = await new AddressService().revokeAddress(request.params._id, language);
      // Respond with the revoked address and a status code of 202 (Accepted).
      response.status(202).json(result);
    } catch (err) {
      // Handle any errors, parse them, and pass them to the next middleware.
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
