import ApiError from "../../../../helpers/ApiError";
import {
  ISyncCartBody,
} from "../../../../interfaces/cart.interfaces";
import { ICartItem } from "../../../../interfaces/model.interfaces";
import { AuthRequest } from "../../../../middlewares/authen.middlewares";
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
    const userId = (req as AuthRequest).user?._id;

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
  size: string;
  quantity: number;
}

export const addToCart = async (
  req: Request<{}, {}, ICartActionBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?._id;
    const { productId, size, quantity } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Chưa xác thực người dùng!" });
      return;
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Nếu chưa có giỏ hàng -> Tạo mới
      cart = new Cart({
        userId,
        items: [{ productId, size, quantity }],
      });
      await cart.save();
    } else {
      // Nếu đã có -> Kiểm tra xem món đồ đã tồn tại chưa
      const existingItemIndex = cart.items.findIndex(
        (item) => String(item.productId) === String(productId) && item.size === size
      );

      if (existingItemIndex > -1) {
        // Đã tồn tại -> Cộng dồn số lượng
        cart.items[existingItemIndex]!.quantity += quantity;
      } else {
        // Chưa tồn tại -> Đẩy vào mảng
        cart.items.push({ productId, size, quantity } as any);
      }
      await cart.save();
    }

    res.status(200).json({ status: true, message: "Thêm vào giỏ thành công" });
  } catch (error) {
    console.error("Lỗi addToCart:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

export const updateCart = async (
  req: Request<{}, {}, ICartActionBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?._id;
    const { productId, size, quantity } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Chưa xác thực người dùng!" });
      return;
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      return;
    }

    const itemIndex = cart.items.findIndex(
      (item) => String(item.productId) === String(productId) && item.size === size
    );

    if (itemIndex > -1) {
      // Ghi đè số lượng mới
      cart.items[itemIndex]!.quantity = quantity;
      await cart.save();
      res.status(200).json({ status: true, message: "Cập nhật thành công" });
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ" });
    }
  } catch (error) {
    console.error("Lỗi updateCart:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};


interface IRemoveCartBody {
  productId: string;
  size: string;
}

export const removeFromCart = async (
  req: Request<{}, {}, IRemoveCartBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?._id;
    const { productId, size } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Chưa xác thực người dùng!" });
      return;
    }

    // Dùng toán tử $pull của MongoDB để gắp thẳng phần tử ra khỏi mảng cực nhanh
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { 
        $pull: { 
          items: { productId: productId, size: size } 
        } 
      },
      { new: true } // Trả về document sau khi update (tùy chọn)
    );

    if (!updatedCart) {
      res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      return;
    }

    res.status(200).json({ status: true, message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Lỗi removeFromCart:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};