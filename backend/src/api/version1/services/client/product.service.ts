import { IProduct } from "./../../../../interfaces/model.interfaces";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";
import Product from "../../../../models/product.model";
import { QueryFilter, SortOrder } from "mongoose";
import { IProductResponse } from "../../../../interfaces/response.interface";

export const getListProductService = async (
  queryFilter: IRequestQueryFilter
): Promise<IProductResponse> => {
  const filterProducts: QueryFilter<IProduct> = {
    isActive: true,
    deleted: false,
  };

  // ---------------- LỌC SẢN PHẨM ---------------------
  if (queryFilter.size) {
    filterProducts["variants.size"] = queryFilter.size.toUpperCase();
  }

  if (queryFilter.price_range) {
    const rangesPrice: string[] = queryFilter.price_range.split(",");

    // Điều kiện sắp xếp theo giá
    const priceConditions = rangesPrice.map((range) => {
      const [minPrice, maxPrice] = range.split("-");
      const min: number = Number(minPrice) || 0;
      if (maxPrice) {
        const max: number = Number(maxPrice);
        return {
          salePrice: { $gte: min, $lte: max },
        };
      } else {
        return {
          salePrice: { $gte: min },
        };
      }
    });

    // gom các điều kiện giá
    priceConditions.length > 0 && (filterProducts.$or = priceConditions);
  }

  // sắp xếp sản phẩm
  let sortConditions: { [key: string]: SortOrder } = { createdAt: -1 };

  if (queryFilter.sort) {
    switch (queryFilter.sort) {
      case "best-selling":
        sortConditions = { isFeatured: -1 };
        break;
      case "price-asc":
        sortConditions = { price: 1 };
        break;
      case "price-desc":
        sortConditions = { price: -1 };
        break;
      case "default":
      default:
        sortConditions = { createdAt: -1 };
        break;
    }
  }

  // ------------------- PHÂN TRANG SẢN PHẨM ---------------
  const page: number = Number(queryFilter.page) || 1; // trang hiện tại
  const limit: number = Number(queryFilter.limit) || 9; // số sản phẩm trên 1 trang

  const skip: number = (page - 1) * limit; // số sản phẩm bỏ qua khi ở số trang là page

  const [totalProducts, products] = await Promise.all([
    Product.countDocuments(filterProducts),
    Product.find(filterProducts)
      .sort(sortConditions)
      .limit(limit)
      .skip(skip)
      .select({
        _id: 1,
        title: 1,
        slug: 1,
        price: 1,
        discountPercentage: 1,
        salePrice: 1,
        media: { $slice: 1 },
      }),
  ]);

  const totalPages: number = Math.ceil(totalProducts / limit);

  return {
    products,
    currentPage: page,
    totalPages: totalPages,
    totalProducts: totalProducts,
  };
};

export const getProductDetailService = async (
  slug: string
): Promise<IProduct | null> => {
  const product = await Product.findOne({
    slug: slug,
    isActive: true,
    deleted: false
  }).select("-__v -deleted -isActive -createAt -updateAt").lean()

  return product as IProduct | null
};
