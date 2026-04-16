import { IProduct } from "./../../../../interfaces/model.interfaces";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";
import Product from "../../../../models/product.model";
import mongoose, { QueryFilter } from "mongoose";
import { IProductResponse } from "../../../../interfaces/response.interface";
import { Category } from "../../../../models/category.model";

export const getListProductService = async (
  queryFilter: IRequestQueryFilter,
  categorySlug?: string
): Promise<IProductResponse> => {
  const pipeline: any[] = [];

  // tìm kiếm theo keyword
  if (queryFilter.keyword) {
    // 1. Chuẩn hóa tiếng Việt và cắt thành mảng các từ
    const normalizedKeyword = queryFilter.keyword.normalize("NFC").trim();
    const searchTerms = normalizedKeyword.split(/\s+/);

    // 2. Thuật toán linh hoạt số lượng từ cần khớp (Dynamic Match)
    let minMatch = searchTerms.length;

    // Nếu khách gõ từ 3 chữ trở lên (VD: "áo sơ mi"), cho phép thiếu 1 chữ
    if (searchTerms.length >= 3) {
      minMatch = searchTerms.length - 1;
    }

    // 3. Tạo mảng điều kiện cho từng từ
    const shouldClauses = searchTerms.map((term) => ({
      text: {
        query: term,
        path: ["title", "tags", "description", "brand"],
      },
    }));

    // 4. Đưa vào pipeline với minimumShouldMatch
    pipeline.push({
      $search: {
        index: "default",
        compound: {
          should: shouldClauses,
          minimumShouldMatch: minMatch, // Bắt buộc phải đạt đủ chỉ tiêu khớp lệnh
        },
      },
    });
  }
  // tạo bộ lọc cứng
  const matchConditions: QueryFilter<IProduct> = {
    isActive: true,
    deleted: false,
  };

  if (categorySlug && categorySlug.trim() !== "all") {
    const targetCategory = await Category.findOne({
      slug: categorySlug,
      isActive: true,
      deleted: false,
    });

    if (!targetCategory) {
      return {
        products: [],
        currentPage: 1,
        totalPages: 0,
        totalProducts: 0,
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

    // Ép kiểu sang ObjectId để dùng trong Aggregation
    const categoryIds = [
      String(targetCategory._id),
      ...getSubCategoryIds(String(targetCategory._id)),
    ].map((id) => new mongoose.Types.ObjectId(id));

    matchConditions.categoryId = { $in: categoryIds };
  }

  if (queryFilter.size) {
    matchConditions["variants.size"] = queryFilter.size.toUpperCase();
  }

  if (queryFilter.color) {
    matchConditions["variants.colorName"] = queryFilter.color.trim();
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
    priceConditions.length > 0 && (matchConditions.$or = priceConditions);
  }

  // đẩy bộ lọc vào ống pipeline
  pipeline.push({ $match: matchConditions });

  let sortConditions: any = null;

  if (queryFilter.sort === "best-selling") sortConditions = { sold: -1 };
  else if (queryFilter.sort === "price-asc") sortConditions = { salePrice: 1 };
  else if (queryFilter.sort === "price-desc")
    sortConditions = { salePrice: -1 };
  else if (!queryFilter.keyword) sortConditions = { createdAt: -1 };

  const page: number = Number(queryFilter.page) || 1;
  const limit: number = Number(queryFilter.limit) || 12; // Mặc định 12 sản phẩm / trang
  const skip: number = (page - 1) * limit;

  // Tạo đường ống nhánh cho việc lấy Dữ liệu hiển thị (Data)
  const dataPipeline: any[] = [];
  if (sortConditions) dataPipeline.push({ $sort: sortConditions });

  dataPipeline.push(
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        price: 1,
        salePrice: 1,
        discountPercentage: 1,
        productStyles: { $slice: ["$productStyles", 1] }, // Chỉ lấy 1 object ảnh đầu tiên cho nhẹ
      },
    }
  );

  // Đẩy nhánh Đếm tổng và nhánh Dữ liệu vào chung $facet
  pipeline.push({
    $facet: {
      metadata: [{ $count: "total" }],
      data: dataPipeline,
    },
  });

  const result = await Product.aggregate(pipeline);

  const totalProducts = result[0].metadata[0]?.total || 0;
  const products = result[0].data;
  const totalPages = Math.ceil(totalProducts / limit);

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
    return [];
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
    return [];
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

export const searchProductService = async (
  keyword: string,
  limit: number = 10
) => {
  const products = await Product.aggregate([
    {
      $search: {
        index: "default",
        text: {
          query: keyword,
          path: ["title", "tags", "description", "brand"],
          fuzzy: {
            maxEdits: 2, // Sức mạnh cốt lõi: Cho phép gõ sai tối đa 2 ký tự (VD: "ao somi" -> "áo sơ mi")
            prefixLength: 1, // Ký tự đầu tiên phải gõ đúng để tăng hiệu năng
          },
        },
      },
    },
    {
      $match: {
        isActive: true,
        deleted: false,
      },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        price: 1,
        salePrice: 1,
        discountPercentage: 1,
        productStyles: { $slice: ["$productStyles", 1] },
      },
    },
  ]);

  return products;
};

export const searchProductFilterService = async (keyword?: string) => {
  const pipeline: any[] = [];

  // 1. NẾU CÓ KEYWORD: Dùng Atlas Search để lọc ra các sản phẩm khớp từ khóa trước
  if (keyword) {
    pipeline.push({
      $search: {
        index: "default",
        text: {
          query: keyword,
          path: ["title", "tags", "description", "brand"],
          fuzzy: { maxEdits: 2, prefixLength: 1 },
        },
      },
    });
  }

  // 2. LỌC CƠ BẢN
  pipeline.push({
    $match: {
      isActive: true,
      deleted: false,
    },
  });

  // 3. DÙNG $FACET ĐỂ TÁCH 2 LUỒNG: LUỒNG LẤY SIZE VÀ LUỒNG LẤY MÀU
  pipeline.push({
    $facet: {
      // --- LUỒNG 1: Gom nhóm SIZE ---
      sizes: [
        { $unwind: "$variants" }, // Tách mảng variants ra thành từng object riêng lẻ
        {
          $group: {
            _id: { $toUpper: "$variants.size" }, // Gom nhóm theo size (chữ hoa)
          },
        },
        { $match: { _id: { $ne: null } } }, // Bỏ qua các size null
        { $sort: { _id: 1 } }, // Sắp xếp A-Z
        {
          $project: {
            _id: 0,
            label: "$_id",
            value: "$_id",
          },
        },
      ],

      // --- LUỒNG 2: Gom nhóm MÀU SẮC ---
      colors: [
        { $unwind: "$productStyles" }, // Tách mảng productStyles
        {
          $group: {
            _id: "$productStyles.colorName", // Gom nhóm theo Tên Màu
            hexCode: { $first: "$productStyles.colorHex" }, // Lấy mã hex đầu tiên của màu đó
          },
        },
        { $match: { _id: { $ne: null } } },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            label: "$_id",
            value: "$_id",
            hexCode: "$hexCode",
          },
        },
      ],
    },
  });

  // Chạy aggregation
  const result = await Product.aggregate(pipeline);

  // result[0] sẽ có dạng { sizes: [...], colors: [...] }
  return result[0];
};
