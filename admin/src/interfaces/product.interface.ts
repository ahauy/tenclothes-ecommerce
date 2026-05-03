export interface IProductStyle {
  colorName: string;
  colorHex: string;
  images: string[];
  isDefault: boolean;
}

export interface IProductVariant {
  sku: string;
  colorName: string;
  size: string;
  stock: number;
  priceDifference: number;
}

export interface IProductAdmin {
  _id: string;
  title: string;
  slug: string;
  description: string;
  categoryIds: {
    _id: string;
    title: string;
  }[];
  brand: string;
  gender: "male" | "female" | "unisex";
  price: number;
  discountPercentage: number;
  salePrice: number;
  productStyles: IProductStyle[];
  variants: IProductVariant[];
  totalStock: number;
  sold: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}
