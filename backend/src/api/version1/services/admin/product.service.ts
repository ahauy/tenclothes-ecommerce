import slug from "../../../../helpers/slugify";
import { IProduct } from "../../../../interfaces/model.interfaces";
import Product from "../../../../models/product.model";
import { ICreateProductReqBody } from "../../validators/admin/product.validator";

export const createProductService = async (
  imageUrls: string[],
  productData: ICreateProductReqBody
): Promise<IProduct> => {
  const newProduct = await Product.create({
    ...productData,
    media: imageUrls,
    categoryIds: productData.categoryIds,
    salePrice: Math.ceil(productData.price*(1 - productData.discountPercentage/100)),
    slug: slug(productData.title),
  });

  return newProduct;
};
