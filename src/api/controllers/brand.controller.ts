import { NextFunction, Request, Response } from "express";
import { BrandService } from "../../services/brand.service";
import Brand from "../../models/brand.model";

import { Offer } from "../../models/offer.model";

/**
 * *Controller class for managing brands.
 */
export class BrandController {
  /**
   * *Adds a new brand to the database.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the brand is successfully added.
   * @throws {Error} - If there is an error adding the brand, an error object is passed to the next middleware function.
   */
  static async addBrand(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      //Add a new brand using the BrandService
      const result: any = await new BrandService().addBrand({ ...request.body });
      // Responde with the created brand and status code of 201 (created)
      response.status(201).json(result);
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Retrieves the brand information for the specified brand name.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the brand information is retrieved and sent as a JSON response. If an error occurs, the promise is rejected with an error object.
   */
  static async getBrand(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Fetch brand details using BrandService by brand name
      const result = await new BrandService().getBrand(request.params.name);
      // Respond with the fetched details and status code 200(success)
      response.status(200).json(result);
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  //BRAND update controller method
  static async updateBrand(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      if (!request.params.id)
        response.status(404).send({ message: "Please provide brand ID:" })
      const results = await new BrandService().updateBrand(request.params.id, request.body)
      response.status(200).send(results)
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Deletes a brand based on the provided ID.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the brand is deleted.
   * @throws {Error} - If an error occurs during the deletion process.
   */
  static async deleteBrand(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Call the BrandService to delete the brand
      const result = await new BrandService().deleteBrand(request.params._id);
      // Respond with the deleted brand and a status code of 202 (Accepted).
      response.status(202).json(result);
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Uploads an image file and associates it with a brand.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the image is uploaded successfully.
   * @throws {Error} - If there is an error during the upload process.
   */
  static async uploadImage(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Retrieve the uploaded file from the request.
      const file = request.file;
      // Create an image object with filename and URL.
      const image = {
        filename: file.filename,
        url: file.path
      };
      // Save the image and get the result using BrandService.
      const result = await new BrandService().uploadImage(request.params.brandId, image);
      // Prepare the response and respond with new brand details and status code 200(success)
      response.status(200).json({ comment: "file uploaded successfully", data: result, newFile: image });
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Uploads a video file  and associates it with a brand.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the video is uploaded successfully.
   * @throws {Error} - If there is an error during the upload process.
   */
  static async uploadVideo(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Retrieve the uploaded file from the request.
      const file = request.file;
      //  Create an video object with filename and URL.
      const video = {
        filename: file.filename,
        url: file.path
      };
      // Save the video and get the result using BrandService.
      const result = await new BrandService().uploadVideo(request.params.brandId, video);
      // Prepare the response and respond with new brand details and status code 200(success)
      response.status(200).json({ comment: "file uploaded successfully", data: result, newFile: video });
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }



  /**
   * *Marks a brand as popular by updating its isPopular property to true.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the brand is marked as popular.
   * @throws {Error} - If there is an error marking the brand as popular.
   */
  static async markBrandAsPopular(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Get the brand ID from the request parameters.
      const brandId = request.params.brandId;

      // Call the BrandService to mark the brand as popular.
      const updatedBrand = await new BrandService().markBrandAsPopular(brandId);

      // If the brand is not found, respond with a 404 error.
      if (!updatedBrand) {
        response.status(404).json({ message: "Brand not found" });
        return;
      }

      // Respond with the updated brand and status code 200(success).
      response.status(200).json({ message: "Brand marked as popular", brand: updatedBrand });
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }



  /**
   * *Retrieves all marked popular brands from the BrandService and sends a JSON response with the data.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   * @throws {Error} - If there is an error retrieving the brands from the BrandService.
   */
  static async getAllMarkedPopularBrands(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Retrieve all marked popular brands from the BrandService.
      const allMarkedPopularBrands = await BrandService.getAllMarkedPopularBrands();
      // Respond with the retrieved brands and status code 200(success).
      response.status(200).json(allMarkedPopularBrands);
    } catch (err) {
      // Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  // Get popular brands by category
  static async getPopularBrandsByCategory(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryId } = request.params;
      const popularBrands = await new BrandService().getPopularBrandsByCategory(categoryId);
      response.status(200).json(popularBrands);
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  // Add product to brand Database
  static async addProductToBrand(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { brandId } = request.params;
      const { productId } = request.body;

      const updatedBrand = await new BrandService().addProductToBrand(brandId, productId);
      response.status(200).json({ message: "Products added to brand", updatedBrand });
    }
    catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  //Brand Offer API
  static async addOfferToBrand(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { brandId } = request.params;
      const offerData: Offer = request.body;
      const updatedBrand = await new BrandService().addOfferToBrand(brandId, offerData);
      response.status(200).json({ message: "Offer added to brand", updatedBrand });
    }
    catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
