import slug from "../../../../helpers/slugify";
import { IProduct } from "../../../../interfaces/model.interfaces";
import Product from "../../../../models/product.model";
import { ICreateProductReqBody } from "../../validators/admin/product.validator";

export const createProductService = async (
  productData: ICreateProductReqBody
): Promise<IProduct> => {

  const newProduct = await Product.create({
    ...productData,
    slug: slug(productData.title),
  } as any); 

  return newProduct;
};

export const updateProductService = async (
  slugKey: string,
  productData: ICreateProductReqBody
): Promise<IProduct | null> => {
  const updatedData = { ...productData } as any;
  if (productData.title) {
    updatedData.slug = slug(productData.title);
  }
  
  const product = await Product.findOneAndUpdate(
    { slug: slugKey, deleted: false },
    updatedData,
    { new: true }
  );
  return product;
};

export const changeStatusProductService = async (
  slug: string,
  status: boolean
): Promise<IProduct | null> => {
  const product = await Product.findOneAndUpdate(
    { slug },
    { isActive: status },
    { new: true }
  );
  return product;
};

export const changeFeaturedProductService = async (
  slug: string,
  isFeatured: boolean
): Promise<IProduct | null> => {
  const product = await Product.findOneAndUpdate(
    { slug },
    { isFeatured },
    { new: true }
  );
  return product;
};

export const deleteProductService = async (
  slug: string
): Promise<IProduct | null> => {
  const product = await Product.findOneAndUpdate(
    { slug },
    { deleted: true },
    { new: true }
  );

  return product;
};
