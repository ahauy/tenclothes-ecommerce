import { IProduct } from "./../../../../interfaces/model.interfaces";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";
import Product from "../../../../models/product.model";
import { QueryFilter, SortOrder } from "mongoose";
import { IProductResponse } from "../../../../interfaces/response.interface";
import { Category } from "../../../../models/category.model";

export const getListProductService = async (
  queryFilter: IRequestQueryFilter,
  categorySlug?: string
): Promise<IProductResponse> => {
  const filterProducts: QueryFilter<IProduct> = {
    isActive: true,
    deleted: false,
  };

  if (categorySlug) {
    // 1. Tìm Category hiện tại dựa vào slug
    const targetCategory = await Category.findOne({
      slug: categorySlug,
      isActive: true,
      deleted: false,
    });

    if (!targetCategory) {
      // Nếu không tìm thấy category, trả về mảng rỗng luôn cho nhanh
      return { products: [], currentPage: 1, totalPages: 0, totalProducts: 0 };
    }

    // 2. Lấy ID của Category hiện tại và TẤT CẢ Category con cháu của nó
    const allCategories = await Category.find({
      isActive: true,
      deleted: false,
    }).select("_id parentId");

    // Hàm đệ quy lấy ID các danh mục con
    const getSubCategoryIds = (parentId: string): string[] => {
      const subs = allCategories.filter(
        (cat) => String(cat.parentId) === String(parentId)
      );
      let subIds = subs.map((cat) => String(cat._id));

      for (const sub of subs) {
        subIds = [...subIds, ...getSubCategoryIds(String(sub._id))];
      }
      return subIds;
    };

    // Mảng categoryIds bao gồm ID của danh mục hiện tại và các danh mục con cháu
    const categoryIds = [
      String(targetCategory._id),
      ...getSubCategoryIds(String(targetCategory._id)),
    ];

    // 3. Thêm điều kiện lọc vào query (Giả sử trường tham chiếu trong Product schema là categoryId)
    filterProducts.categoryId = { $in: categoryIds };
  }

  // ---------------- LỌC SẢN PHẨM ---------------------
  if (queryFilter.size) {
    filterProducts["variants.size"] = queryFilter.size.toUpperCase();
  }

  if (queryFilter.color) {
    filterProducts["variants.colorName"] = queryFilter.color.trim();
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
        sortConditions = { sold: -1 };
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
        productStyles: { $slice: 1 }, // Lấy Style đầu tiên để làm ảnh bìa
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
    deleted: false,
  })
    .select("-__v -deleted -isActive -createAt -updateAt")
    .lean();

  return product as IProduct | null;
};

export const getCategoryFilterService = async (categorySlug: string) => {
  const targetCategory = await Category.findOne({
    slug: categorySlug,
    isActive: true,
    deleted: false,
  });

  if (!targetCategory) {
    return {
      sizes: [],
      colors: [],
    };
  }

  const allCategories = await Category.find({
    isActive: true,
    deleted: false,
  }).select("_id parentId");

  const getSubCategoryIds = (parentId: string): string[] => {
    const subs = allCategories.filter(
      (cat) => String(cat.parentId) === String(parentId)
    );
    let subIds = subs.map((cat) => String(cat._id));

    for (const sub of subs) {
      subIds = [...subIds, ...getSubCategoryIds(String(sub._id))];
    }

    return subIds;
  };

  const categoryIds = [
    String(targetCategory._id),
    ...getSubCategoryIds(String(targetCategory._id)),
  ];

  const productOfCateogyIds = await Product.find({
    categoryId: { $in: categoryIds },
    isActive: true,
    deleted: false,
  })
    .select("variants.size productStyles.colorName productStyles.colorHex")
    .lean();

  const sizeSet = new Set<string>();
  const colorMap = new Map<string, string>();

  productOfCateogyIds.forEach((p) => {
    p.variants?.forEach((v) => v.size && sizeSet.add(v.size.toUpperCase()));
    p.productStyles?.forEach(
      (s) => s.colorName && s.colorHex && colorMap.set(s.colorName, s.colorHex)
    );
  });

  return {
    sizes: Array.from(sizeSet)
      .sort()
      .map((s) => ({ label: s, value: s })),
    colors: Array.from(colorMap.entries()).map(([name, hex]) => ({
      label: name,
      value: name,
      hexCode: hex,
    })),
  };
};

export const getLatestCollectionService = async (limit: number) => {
  const data = await Product.find({
    deleted: false,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select({
      _id: 1,
      title: 1,
      slug: 1,
      price: 1,
      discountPercentage: 1,
      salePrice: 1,
      productStyles: { $slice: 1 }, // Lấy Style đầu tiên để làm ảnh bìa
    })
    .lean();

  if (!data) {
    return []
  }

  return data;
};

export const getBestSellingService = async (limit: number) => {
  const data = await Product.find({
    deleted: false,
    isActive: true,
  })
    .sort({ sold: -1 })
    .limit(limit)
    .select({
      _id: 1,
      title: 1,
      slug: 1,
      price: 1,
      discountPercentage: 1,
      salePrice: 1,
      productStyles: { $slice: 1 }, // Lấy Style đầu tiên để làm ảnh bìa
    })
    .lean();

  if (!data) {
    return []
  }

  return data;
};

export const getRelatedProductsService = async (
  slug: string,
  limit: number
) => {
  const product = await Product.findOne({
    slug: slug,
    isActive: true,
    deleted: false,
  }).select("categoryId _id");

  if (!product) return [];

  const relatedProducts = await Product.find({
    categoryId: product.categoryId,
    _id: { $ne: product._id }, // $ne (Not Equal) giúp loại trừ sản phẩm đang xem
    isActive: true,
    deleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select({
      _id: 1,
      title: 1,
      slug: 1,
      price: 1,
      salePrice: 1,
      discountPercentage: 1,
      productStyles: { $slice: 1 },
    });

  return relatedProducts;
};
