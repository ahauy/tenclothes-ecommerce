import mongoose from "mongoose";
import { ICategory, ICategoryTree } from "../interfaces/category.interfaces";



export const buildCategoryTree = (
  categories: ICategory[],
  parentId: mongoose.Types.ObjectId | null = null // Nên gán default parameter là null ở đây
): ICategoryTree[] => {
  return categories
    .filter((cat) => String(cat.parentId) === String(parentId))
    .map((cat) => {
      return {
        ...cat,
        children: buildCategoryTree(categories, cat._id),
      };
    });
};
