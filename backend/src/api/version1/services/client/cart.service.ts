import {
  ICart,
  ICartItem,
  IOrderProductItem,
} from "../../../../interfaces/model.interfaces";
import Product from "../../../../models/product.model";
import { IFormattedCart, IPopulatedCart } from "../../../../interfaces/cart.interfaces";
import { Cart } from "../../../../models/cart.model";

export const validateLocalCartSevice = async (
  items: ICartItem[]
): Promise<IOrderProductItem[]> => {
  // Dùng Promise.all để tìm thông tin gốc của từng sản phẩm trong mảng
  const validItems: (IOrderProductItem | null)[] = await Promise.all(
    items
      .map(async (item: ICartItem) => {
        const product = await Product.findById(item.productId);

        // Nếu sản phẩm đã bị Admin xóa
        if (!product) return null;

        // Kiểm tra xem size đó còn hàng trong kho không
        const variant = product.variants.find((v) => v.size === item.size);
        const isOutOfStock = !variant || variant.stock < item.quantity;

        // Trả về dữ liệu MỚI NHẤT cho Frontend
        return {
          productId: product._id,
          slug: product.slug,
          title: product.title,
          image: product.media[0] || "",
          size: item.size,
          quantity: item.quantity,
          price: product.price,
          salePrice: product.salePrice, // Giá MỚI NHẤT lúc này
          isOutOfStock: isOutOfStock, // Cờ báo hiệu cho Frontend
        };
      })
      .filter((item) => item !== null)
  );

  return validItems as unknown as IOrderProductItem[];
};

export const syncCartService = async (
  userId: string,
  localItemsCart: ICartItem[]
): Promise<IFormattedCart[]> => {
  let cart: ICart | null = await Cart.findOne({ userId: userId });

  if (cart === null) {
    // Nếu người dùng chưa có giỏ hàng
    cart = new Cart({
      userId,
      items: localItemsCart,
    });
  } else {
    // Nếu user đã có giỏ hàng thì tiến hành gộp lại
    localItemsCart.forEach((localItem: ICartItem) => {
      const existingItemIndex = cart!.items.findIndex(
        (dbItem: ICartItem) =>
          String(dbItem.productId) === String(localItem.productId) &&
          dbItem.size === localItem.size
      );

      if (existingItemIndex > -1) {
        // Đã có
        cart!.items[existingItemIndex]!.quantity += localItem.quantity;
      } else {
        // Chua co
        cart!.items.push(localItem);
      }
    });
  }
  // luu gio hang
  await cart.save();

  const populatedCart = (await Cart.findById(cart._id)
    .populate({
      path: "items.productId",
      select: "slug title price salePrice media",
    })
    .lean()) as unknown as IPopulatedCart | null;

  const formattedItems: IFormattedCart[] = populatedCart!.items
    .map((item) => {
      const product = item.productId;

      if (!product) return null;

      return {
        productId: product._id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        salePrice: product.salePrice,
        image:
          product.media && product.media.length > 0 ? product.media[0] : "",
        size: item.size,
        quantity: item.quantity,
      };
    })
    .filter((item): item is IFormattedCart => item !== null);

  return formattedItems
};
