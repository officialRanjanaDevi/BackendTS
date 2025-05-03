import { NextFunction, Request, Response } from "express";
import { CategoryService } from "../../services/category.service";
// import Category from "../../models/category.model";
import { db } from "../../config/database.config";
import Category from "../../models/category.model";

/**
 * *Controller class for managing categories.
 */
export class CategoryController {
  /**
   * *Creates a new category by handling the HTTP POST request.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next function to be called in the middleware chain.
   * @returns {Promise<void>} - A promise that resolves when the category is successfully created.
   * @throws {Error} - If there is an error while creating the category.
   */
  static async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      //Add a new category using the CategoryService
      const result = await new CategoryService().addCategory(request.body);
      // Responde with the created category and status code of 201 (created)
      response.status(201).json(result);
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async createSubCategory(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      //Add a new sub category using the CategoryService
      const result = await new CategoryService().addSubCategory(request.body);
      // Responde with the created category and status code of 201 (created)
      response.status(201).json(result);
    } catch (err) {
      // Handle any error, if any ,parse them and pass to next middleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Retrieves a single category based on the provided ID.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves to nothing.
   * @throws {Error} - If an error occurs while retrieving the category.
   */
  static async getOne(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Fetch category details using CategoryService by ID
      const category = await new CategoryService().getOne(request.params._id);
      // Respond with the fetched details and status code 200(success)
      response.status(200).json(category);
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Retrieves all categories based on the provided filters.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs while retrieving the categories.
   */
  static async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { filters } = request.body;

      // Fetch category details using CategoryService passing the filters
      const categories = await new CategoryService().getAll(filters);
      
      // Fetch subcategories for each category using Promise.all
      const subCategories = await Promise.all(
        categories.map(async (category) => {
          return await Category.find({ parent: category._id });
        })
      );
      
      // Respond with the fetched details and status code 200(success)
      response.status(200).json({ categories, subCategories });
      
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Handles the dashboard Categories request and returns the categories hierarchy.
   * @param {Request} request - The request object.
   * @param {Response} response - The response object.
   * @param {NextFunction} next - The next function to call in the middleware chain.
   * @returns {Promise<void>} - None
   * @throws {Error} - If an error occurs during the process.
   */
  static async dashboardCategories(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // fetch the cached dashboard categories from redis
      // const cachedResult = await db.get("dashboardCategories");
      // // if the cached result is not null, return it
      // if (cachedResult) {
      //   // return the cached result
      //   response.status(200).json(JSON.parse(cachedResult));
      // } else {
      // if the cached result is null, fetch the dashboard categories from the database using CategoryService
      const result = await new CategoryService().getCategoriesHierarchy();
      // cache the result in redis
      // await db.set("dashboardCategories", JSON.stringify(result));
      // return the result
      response.status(200).json(result);
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Updates a category with the given ID using the data from the request body.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next function to call in the middleware chain.
   * @returns {Promise<void>} - A promise that resolves when the category is updated.
   * @throws {Error} - If there is an error updating the category.
   */
  static async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Update the category using CategoryService
      const result = await new CategoryService().updateCategory(request.params._id, { ...request.body });
      // Respond with the updated category and status code 202(accepted)
      response.status(202).json(result);
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Deletes a category based on the provided ID.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the category is deleted.
   * @throws {Error} - If there is an error deleting the category.
   */
  static async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Delete the category using CategoryService
      const result = await new CategoryService().deleteCategory(request.params._id);
      // Respond with the deleted category and status code 202(accepted)
      response.status(202).json({ message: "Category deleted successfully", data: result });
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   *
   * *Uploads an image file and add its details to that specific category.
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
      // Create a new image object with the filename and URL.
      const image = {
        filename: file.filename,
        url: file.path
      };
      // Save the image and get the result using CategoryService
      const result = await new CategoryService().uploadImage(request.params.categoryId, image);
      // Respond with the image and status code 200(OK)
      response.status(200).json({ comment: "file uploaded successfully", data: result, newFile: image });
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   *
   * *Marks a category as featured.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the category is marked as featured.
   * @throws {Error} - If the category is not found, an error is thrown with a message "Category not found".
   *                   If any other error occurs, an error object is passed to the next middleware function.
   */
  static async markAsFeatured(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Retrieve the category ID from the request parameters
      const { categoryId } = request.params;
      // Mark the category as featured using CategoryService
      const result = await new CategoryService().markCategoryAsFeatured(categoryId);
      // Respond with the marked category and status code 200(OK)
      response.status(200).json(result);
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   *
   * *Marks a category as not featured.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the category is successfully unmarked as featured.
   * @throws {Error} - If the category is not found, an error with a message "Category not found" is thrown.
   *                   If any other error occurs, an error object with properties code, message, and error is passed to the next middleware.
   */
  static async unMarkAsFeatured(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Retrieve the category ID from the request parameters
      const { categoryId } = request.params;
      // Mark the category as not featured using CategoryService
      const result = await new CategoryService().umMarkCategoryAsFeatured(categoryId);
      // Respond with the unmarked category and status code 200(OK)
      response.status(200).json(result);
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   *
   * *Retrieves all marked featured categories from the database and returns them as a JSON response.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If there is an error retrieving the categories from the database.
   */

  static async getAllMarkedFeaturedCategories(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Retrieve all marked featured categories from the redis cache
      const cachedResult = await db.get("featuredCategories");
      // if the cachedResult is not null, return it as a JSON response
      if (cachedResult) {
        // return the cached result
        response.status(200).json(JSON.parse(cachedResult));
      } else {
        //if the cachedResult is null Retrieve all marked featured categories from the database
        const result = await new CategoryService().getAllMarkedFeaturedCategories();
        // Save the result in the redis cache
        await db.set("featuredCategories", JSON.stringify(result));
        // return the result
        response.status(200).json(result);
      }
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  /**
   * *Handles the request for the homepage categories.
   * @param {Request} request - The HTTP request object.
   * @param {Response} response - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns None
   * @throws {Error} If an error occurs while handling the request.
   */
  static async homepageCategories(request: Request, response: Response, next: NextFunction) {
    try {
      //Todo: implement the home page category logic to show categories on homepage
      //Todo: subactegories for each category needs to be added in the databse for this purpose
    } catch (err) {
      //Handle any error, if any ,parse them and pass to next midddleware
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getAllSubcategoriesByCategoryId(req: Request, res: Response): Promise<void> {
    const { categoryId } = req.params;

    try {
      const subcategories = await CategoryService.getAllSubcategoriesByCategoryId(categoryId);
      res.status(200).json(subcategories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
