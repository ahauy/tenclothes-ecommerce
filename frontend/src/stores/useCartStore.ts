import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/axios"; // Hãy đảm bảo bạn import axios instance của dự án
import { useAuthStore } from "./useAuthStore";

export interface ICartItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  salePrice: number;
  size: string;
  image: string;
  quantity: number;
  isOutOfStock?: boolean;
}

export interface ShopState {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  cartItems: ICartItem[];

  // Chuyển các hàm thành async để gọi API
  addToCart: (item: ICartItem) => Promise<void>;
  removeFromCart: (productId: string, size: string) => Promise<void>;
  updateQuantity: (
    productId: string,
    size: string,
    quantity: number
  ) => Promise<void>;
  setCart: (items: ICartItem[]) => void;
  clearCart: () => void;
}

// HÀM KIỂM TRA ĐĂNG NHẬP
// Tùy thuộc vào dự án của bạn, bạn có thể lấy token từ localStorage
// hoặc dùng store: useAuthStore.getState().isAuthenticated
const isAuthenticated = () => {
  const accessToken = useAuthStore.getState().accessToken;

  return accessToken ? accessToken : null
};

export const useCartStore = create<ShopState>()(
  persist(
    (set) => ({
      openModal: false,
      setOpenModal: (open) => set({ openModal: open }),

      // STATE GIỎ HÀNG
      cartItems: [],

      // ACTION: Thêm vào giỏ
      addToCart: async (item) => {
        // 1. Cập nhật State ngay lập tức cho UI mượt mà
        set((state) => {
          const existingItemIndex = state.cartItems.findIndex(
            (i) => i.productId === item.productId && i.size === item.size
          );

          if (existingItemIndex !== -1) {
            const newCart = [...state.cartItems];
            newCart[existingItemIndex].quantity += item.quantity;
            return { cartItems: newCart };
          } else {
            return { cartItems: [...state.cartItems, item] };
          }
        });

        // 2. Nếu đã đăng nhập, gọi API chạy ngầm lưu vào Database
        if (isAuthenticated()) {
          try {
            await api.post(
              "/cart/add",
              {
                productId: item.productId,
                size: item.size,
                quantity: item.quantity,
              },
              {
                headers: {
                  // Nhét thủ công Access Token vào đúng cái định dạng mà verifyToken đang chờ đón
                  Authorization: `Bearer ${isAuthenticated()}`,
                },
              }
            );
          } catch (error) {
            console.error("Lỗi đồng bộ giỏ hàng lên Server", error);
          }
        }
      },

      // ACTION: Cập nhật số lượng
      updateQuantity: async (productId, size, quantity) => {
        // 1. Cập nhật State ngay lập tức
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));

        // 2. Cập nhật lên Database nếu đã đăng nhập
        if (isAuthenticated()) {
          try {
            await api.patch(
              "/cart/update",
              { productId, size, quantity },
              {
                headers: {
                  // Nhét thủ công Access Token vào đúng cái định dạng mà verifyToken đang chờ đón
                  Authorization: `Bearer ${isAuthenticated()}`,
                },
              }
            );
          } catch (error) {
            console.error("Lỗi cập nhật số lượng trên Server", error);
          }
        }
      },

      // ACTION: Xóa khỏi giỏ
      removeFromCart: async (productId, size) => {
        // 1. Cập nhật State ngay lập tức
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => !(item.productId === productId && item.size === size)
          ),
        }));

        // 2. Xóa trên Database nếu đã đăng nhập
        if (isAuthenticated()) {
          try {
            // Tùy theo backend bạn viết body như thế nào cho method DELETE
            await api.patch("/cart/remove", { data: { productId, size } }, {
              headers: {
                Authorization: `Bearer ${isAuthenticated()}`,
              },
            });
          } catch (error) {
            console.error("Lỗi xóa sản phẩm trên Server", error);
          }
        }
      },

      // ACTION: Cập nhật toàn bộ giỏ hàng (Dùng khi đăng nhập xong gọi hàm gộp giỏ)
      setCart: (items) => {
        set({ cartItems: items });
      },

      // ACTION: Xóa toàn bộ giỏ (Dùng sau khi thanh toán thành công)
      clearCart: () => {
        // Vì API Checkout bên backend đã tự động dọn Database của user rồi,
        // nên ở đây ta chỉ cần dọn dẹp state local là đủ.
        set({ cartItems: [] });
      },
    }),
    {
      name: "cart-storage", // Tên key lưu trong LocalStorage
      partialize: (state) => ({
        // Chỉ lưu 3 trường cốt lõi xuống localStorage để chống hack giá
        cartItems: state.cartItems.map((item) => {
          return {
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
          };
        }),
      }),
    }
  )
);
