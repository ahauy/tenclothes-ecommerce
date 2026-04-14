import {
  ICart,
  ICartItem,
  IOrderProductItem,
  IProductStyle,
} from "../../../../interfaces/model.interfaces";
import Product from "../../../../models/product.model";
import {
  IFormattedCart,
  IPopulatedCart,
} from "../../../../interfaces/cart.interfaces";
import { Cart } from "../../../../models/cart.model";

export const validateLocalCartSevice = async (
  items: ICartItem[]
): Promise<IOrderProductItem[]> => {
  const validItems = await Promise.all(
    items.map(async (item: ICartItem) => {

      const product = await Product.findOne({_id: item.productId})

      if (!product) return null;

      // Tìm variant khớp cả Size và Màu sắc
      const variant = product.variants.find(
        (v) => v.size === item.size && v.colorName === item.color
      );

      // Tìm Style để lấy đúng ảnh của màu đó
      const style =
        product.productStyles.find((s) => s.colorName === item.color) ||
        product.productStyles[0];

      const isOutOfStock = !variant || variant.stock < item.quantity;

      return {
        productId: product._id,
        sku: variant?.sku || item.sku, // Lấy mã SKU
        slug: product.slug,
        title: product.title,
        color: item.color, // Bổ sung màu sắc
        size: item.size,
        image: style?.images[0] || "", // Lấy ảnh đầu tiên của màu đã chọn
        quantity: item.quantity,
        price: product.price,
        salePrice: product.salePrice,
        isOutOfStock: isOutOfStock,
      };
    })
  );

  return validItems.filter(
    (item) => item !== null
  ) as unknown as IOrderProductItem[];
};

export const syncCartService = async (
  userId: string,
  localItemsCart: ICartItem[]
): Promise<IFormattedCart[]> => {
  let cart: ICart | null = await Cart.findOne({ userId: userId });

  if (cart === null) {
    cart = new Cart({ userId, items: localItemsCart });
  } else {
    localItemsCart.forEach((localItem: ICartItem) => {
      // Phải check trùng cả ID, Size và Màu sắc
      const existingItemIndex = cart!.items.findIndex(
        (dbItem: ICartItem) =>
          String(dbItem.productId) === String(localItem.productId) &&
          dbItem.size === localItem.size &&
          dbItem.color === localItem.color
      );

      if (existingItemIndex > -1) {
        cart!.items[existingItemIndex]!.quantity += localItem.quantity;
      } else {
        cart!.items.push(localItem);
      }
    });4
  }
  await cart.save();

  const populatedCart = (await Cart.findById(cart._id)
    .populate({
      path: "items.productId",
      select: "slug title price salePrice productStyles", // Thay media thành productStyles
    })
    .lean()) as unknown as IPopulatedCart | null;

  const formattedItems: IFormattedCart[] = populatedCart!.items
    .map((item) => {
      const product = item.productId;
      if (!product) return null;

      // Tìm đúng mảng ảnh của màu sắc đó
      const style =
        product.productStyles?.find((s: IProductStyle) => s.colorName === item.color) ||
        product.productStyles?.[0];

      return {
        productId: product._id,
        sku: item.sku,
        slug: product.slug,
        title: product.title,
        price: product.price,
        salePrice: product.salePrice,
        color: item.color,
        size: item.size,
        image: style?.images[0] || "",
        quantity: item.quantity,
      };
    })
    .filter((item): item is IFormattedCart => item !== null);

  return formattedItems;
};
