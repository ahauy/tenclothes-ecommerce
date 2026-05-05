import ApiError from "../../../../helpers/ApiError";
import {
  ISyncCartBody,
} from "../../../../interfaces/cart.interfaces";
import { ICartItem } from "../../../../interfaces/model.interfaces";
import { IAuthRequest } from "../../../../middlewares/authen.middlewares";
import { Request, Response } from "express";
import {
  syncCartService,
  validateLocalCartSevice,
} from "../../services/client/cart.service";
import { Cart } from "../../../../models/cart.model";

// Xác thực dữ liệu của giỏ hàng lưu trong localStorage
export const validateLocalCart = async (
  req: Request<{}, {}, ISyncCartBody>,
  res: Response
) => {
  try {
    const items: ICartItem[] = req.body.items; // Mảng [{ productId, size, quantity }]

    const finalCart = await validateLocalCartSevice(items);

    res.status(200).json({ status: true, data: finalCart });
  } catch (error) {
    console.error("Có lỗi trong validateLocalCart: ", error);

    // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: false,
        message: error.message, // Sẽ in ra "Email đã được sử dụng!"
      });
      return;
    }

    // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// Đồng bộ giỏ hàng khi đăng nhập
export const syncCart = async (
  req: Request<{}, {}, ISyncCartBody>,
  res: Response
) => {
  try {
    const userId = (req as IAuthRequest).user?._id;

    if (!userId) {
      res.status(401).json({
        message: "Không tìm thấy thông tin người dùng!",
      });
      return;
    }

    const localItemsCart: ICartItem[] = req.body.items || [];

    const formattedItems = syncCartService(userId, localItemsCart);

    res.status(200).json({
      status: true,
      message: "Đồng bộ giỏ hàng thành công!",
      data: formattedItems,
    });
  } catch (error) {
    console.error("Có lỗi trong syncCart: ", error);

    // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: false,
        message: error.message, // Sẽ in ra "Email đã được sử dụng!"
      });
      return;
    }

    // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};


interface ICartActionBody {
  productId: string;
  sku?: string;
  color: string; // Thêm màu sắc
  size: string;
  quantity: number;
}

export const addToCart = async (
  req: Request<{}, {}, ICartActionBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as IAuthRequest).user?._id;
    const { productId, sku, color, size, quantity } = req.body;

    if (!userId) { res.status(401).json({ message: "Chưa xác thực người dùng!" }); return; }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, sku, color, size, quantity }] });
      await cart.save();
    } else {
      // Tìm theo cả 3 tham số
      const existingItemIndex = cart.items.findIndex(
        (item) => String(item.productId) === String(productId) && item.size === size && item.color === color
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex]!.quantity += quantity;
      } else {
        cart.items.push({ productId, sku, color, size, quantity } as any);
      }
      await cart.save();
    }
    res.status(200).json({ status: true, message: "Thêm vào giỏ thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};

export const updateCart = async (
  req: Request<{}, {}, ICartActionBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as IAuthRequest).user?._id;
    const { productId, color, size, quantity } = req.body;

    if (!userId) { res.status(401).json({ message: "Chưa xác thực người dùng!" }); return; }

    const cart = await Cart.findOne({ userId });
    if (!cart) { res.status(404).json({ message: "Không tìm thấy giỏ hàng" }); return; }

    const itemIndex = cart.items.findIndex(
      (item) => String(item.productId) === String(productId) && item.size === size && item.color === color
    );

    if (itemIndex > -1) {
      cart.items[itemIndex]!.quantity = quantity;
      await cart.save();
      res.status(200).json({ status: true, message: "Cập nhật thành công" });
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};

interface IRemoveCartBody {
  productId: string;
  color: string;
  size: string;
}

export const removeFromCart = async (
  req: Request<{}, {}, IRemoveCartBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as IAuthRequest).user?._id;
    const { productId, color, size } = req.body;

    if (!userId) { res.status(401).json({ message: "Chưa xác thực người dùng!" }); return; }

    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { 
        $pull: { 
          items: { productId: productId, size: size, color: color } // Xóa chính xác variant
        } 
      },
      { returnDocument: "after" }
    );

    if (!updatedCart) { res.status(404).json({ message: "Không tìm thấy giỏ hàng" }); return; }

    res.status(200).json({ status: true, message: "Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};