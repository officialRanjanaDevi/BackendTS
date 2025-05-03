import Category, { ICategory } from "../models/category.model";
import SubCategory, { ISubcategory } from "../models/category-sub.model";
import { buildQuery } from "../helpers/queryBuilder";
import Product from "../models/product.model";
/**
 * *Service class for managing categories.
 */
export class CategoryService {
  /**
   * *Adds a new category to the database.
   * @param {any} data - The data object containing the category information.
   * @returns {Promise<Category>} A promise that resolves to the saved category object.
   */
  async addCategory(data: any) {
    // Create a new category
    const category = new Category(data);
    // Save the category
    return category.save();
  }

  /**
   * *Adds a new subcategory to the database.
   * @param {any} data - The data object containing the subcategory information.
   * @returns {Promise<SubCategory>} A promise that resolves to the saved subcategory object.
   */
  async addSubCategory(data: any) {
    const subcategory = new SubCategory(data);
    return subcategory.save();
  }

  /**
   *
   * *Retrieves a single category from the database based on the provided category ID.
   * @param {string} categoryId - The ID of the category to retrieve.
   * @returns {Promise<Category>} A promise that resolves to the retrieved category object.
   */
  async getOne(categoryId: string) {
    // Find the category by ID
    return await Category.findOne({ _id: categoryId }).exec();
  }

  /**
   *
   * *Retrieves all categories from the database that match the given filters.
   * @param {Record<string, any>} filters - The filters to apply to the query.
   * @returns {Promise<Category[]>} - A promise that resolves to an array of Category objects.
   */
  async getAll(filters: Record<string, any>) {
    //build the database query using buildQuery function
    const query = buildQuery(filters);
    // Find all categories that match the query and return
    return await Category.find(query).exec();
  }

  /**
   *
   * *Retrieves the hierarchy of categories from the database.
   * @returns {Promise<Array<Object>>} - A promise that resolves to an array of category objects representing the category hierarchy.
   */

  async getCategoriesHierarchy() {
    // Find all categories from dastabase
    const allCategories = await Category.find().exec();
    // Builds the category tree
    async function buildCategoryTree(category: ICategory) {
      // Find all children of the current category
      // Why do we need to query db again ??
      const children = await Category.find({ parent: category._id }).exec();
  
      // If there is at least one child, recursively build the tree
      if (children.length > 0) {
        // Recursively build the category tree for each child
        const childPromises = children.map((child) => buildCategoryTree(child));
     
        // Resolve all child promises
        const resolvedChildren = await Promise.all(childPromises);
        // Return the category object with its children
        return {
          ...category.toObject(),
          children: resolvedChildren
        };
      } else {
        // if there are no children return the category object
        return { ...category.toObject() };
      }
    }

    // Call the buildCategoryTree function for each category whose parent is null
    const categoryTreePromises = allCategories.filter((category) => !category.parent).map((category) => buildCategoryTree(category));

    // Resolve all category tree promises
    const categoryTree = await Promise.all(categoryTreePromises);

    // Return the category tree
    return categoryTree;
  }

  /**
   * *Updates a category with the given ID using the provided data.
   * @param {string} categoryId - The ID of the category to update.
   * @param {any} data - The data to update the category with.
   * @returns {Promise<any>} - A promise that resolves to the updated category.
   */
  async updateCategory(categoryId: string, data: any) {
    //find and update the category and return it
    return await Category.findByIdAndUpdate(categoryId, data, {
      new: true
    }).exec();
  }

  /**
   * *Deletes a category from the database based on the provided category ID.
   * @param {string} categoryId - The ID of the category to delete.
   * @returns {Promise} A promise that resolves to the deleted category.
   */
  async deleteCategory(categoryId: string) {
    //find and delete the category and return it
    return await Category.findByIdAndDelete(categoryId).exec();
  }

  /**
   *
   * *Update the image of category.
   * @param {string} categoryId - The ID of the category to upload the image to.
   * @param {any} image - The image to upload.
   * @returns {Promise<Category>} A promise that resolves to the updated category object.
   */
  async uploadImage(categoryId: string, image: any) {
    // Update the category image
    return await Category.findByIdAndUpdate(categoryId, { image: image }).exec();
  }

  /**
   * *Marks a category as featured by setting the "featured" property to true.
   * @param {string} categoryId - The ID of the category to mark as featured.
   * @returns {Promise<{ message: string, category: Category }>} - A promise that resolves to an object containing a success message and the updated category.
   * @throws {Error} - If the category is not found or an error occurs during the process.
   */
  async markCategoryAsFeatured(categoryId: string) {
    try {
      // Find the category by ID
      const category = await Category.findById(categoryId).exec();

      // Check if the category exists
      if (!category) {
        // Throw an error if the category is not found
        throw new Error("Category not found");
      }

      // Update the category's status to mark it as featured
      category.featured = true;
      // Save the updated category
      await category.save();
      // Return the updated category
      return { message: "Category marked as featured", category };
    } catch (error) {
      // Throw an error if an error occurs during the process
      throw new Error(error.message);
    }
  }

  /**
   * *Marks a category as not featured.
   * @param {string} categoryId - The ID of the category to mark as not featured.
   * @returns {Promise<{ message: string, category: Category }>} - A promise that resolves to an object containing a message and the updated category.
   * @throws {Error} - If the category is not found or an error occurs during the process.
   */
  async umMarkCategoryAsFeatured(categoryId: string) {
    try {
      // Find the category by ID
      const category = await Category.findById(categoryId).exec();

      // Check if the category exists
      if (!category) {
        // Throw an error if the category is not found
        throw new Error("Category not found");
      }

      // Update the category's status to mark it as featured
      category.featured = false;
      // Save the updated category
      await category.save();
      // Return the updated category
      return { message: "Category unmarked as featured", category };
    } catch (error) {
      // Throw an error if an error occurs during the process
      throw new Error(error.message);
    }
  }

  /**
   * *Retrieves all marked featured categories from the database and builds a category tree structure.
   * @returns {Promise<ICategory[]>} - A promise that resolves to an array of featured categories.
   * @throws {Error} - If there is an error fetching the featured categories.
   */
  async getAllMarkedFeaturedCategories(): Promise<ICategory[]> {
    try {
      // Retrieve all marked featured categories
      const allCategories = await Category.find().exec();

      // Builds the category tree
      async function buildCategoryTree(category: ICategory) {
        // Find all children of the current category
        const children = await Category.find({ parent: category._id }).exec();
        // If there is at least one child, recursively build the tree
        if (children.length > 0) {
          // Recursively build the category tree for each child
          const childPromises = children.map((child) => buildCategoryTree(child));
          // Resolve all child promises
          const resolvedChildren = await Promise.all(childPromises);
          // Return the category with its children
          return {
            ...category.toObject(),
            children: resolvedChildren
          };
        } else {
          // If there are no children, return the category
          return { ...category.toObject() };
        }
      }

      // Build the category tree for each marked featured category
      const featuredCategoriesPromises = allCategories.filter((category) => category.featured === true).map((category) => buildCategoryTree(category));

      // Resolve all category tree promises
      const featuredCategories = await Promise.all(featuredCategoriesPromises);

      // Return the category tree
      return featuredCategories;
    } catch (error) {
      // Throw an error if there is an error fetching the featured categories
      throw new Error("Error fetching featured categories");
    }
  }

  static async getAllSubcategoriesByCategoryId(categoryId: string): Promise<ISubcategory[]> {
    try {
      const subcategories = await SubCategory.find({ category: categoryId });
      return subcategories;
    } catch (error) {
      throw new Error(`Error getting subcategories: ${error.message}`);
    }
  }
}
