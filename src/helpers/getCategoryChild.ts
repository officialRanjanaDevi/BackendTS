import Category from "../models/category.model";

export async function getAllCategoryIds(parentCategoryId: string): Promise<string[]> {
  // Initialize an array to store all category IDs (including the parent)
  let allCategoryIds = [parentCategoryId];

  // Recursive function to find all children
  async function findChildren(categoryId: string) {
    const childCategories = await Category.find({ parent: categoryId }).exec();

    if (childCategories.length > 0) {
      // Add child category IDs to the array
      allCategoryIds = [...allCategoryIds, ...childCategories.map((cat) => cat._id.toString())];

      // Recursively search for each child's children
      for (const child of childCategories) {
        await findChildren(child._id);
      }
    }
  }

  // Start recursion with the parent category
  await findChildren(parentCategoryId);

  return allCategoryIds;
}
