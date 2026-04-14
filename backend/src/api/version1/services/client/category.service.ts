import { buildCategoryTree } from "../../../../helpers/buildCategoryTree";
import { ICategory, ICategoryTree } from "../../../../interfaces/category.interfaces";
import { Category } from "../../../../models/category.model";

export const categoryTreeClientService = async (): Promise<ICategoryTree[]> => {
  const categories = await Category.find({
    deleted: false,
    isActive: true,
  })
    .select("_id title slug level thumbnail parentId")
    .lean();
  
  const categoryTree: ICategoryTree[] =  buildCategoryTree(categories as ICategory[], null)

  return categoryTree
};
