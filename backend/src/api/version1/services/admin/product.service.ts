import slug from "../../../../helpers/slugify";
import { IProduct } from "../../../../interfaces/model.interfaces";
import Product from "../../../../models/product.model";
import { ICreateProductReqBody } from "../../validators/admin/product.validator";

export const createProductService = async (
  productData: ICreateProductReqBody
): Promise<IProduct> => {
  // Ép kiểu 'as any' ở đây để vượt qua lỗi exactOptionalPropertyTypes của Mongoose
  // Zod đã làm nhiệm vụ gác cổng an toàn cho chúng ta rồi.
  const newProduct = await Product.create({
    ...productData,
    slug: slug(productData.title),
  } as any); 

  return newProduct;
};

export const changeStatusProductService = async (
  id: string,
  status: boolean
): Promise<IProduct | null> => {
  const product = await Product.findByIdAndUpdate(
    id,
    { isActive: status },
    { new: true }
  );
  return product;
};
