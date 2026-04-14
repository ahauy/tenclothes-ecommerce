import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/axios"; 
import { useAuthStore } from "./useAuthStore";

// 1. CẬP NHẬT INTERFACE: Thêm color và sku
export interface ICartItem {
  productId: string;
  sku: string; // Mã kho cực kỳ quan trọng khi đặt hàng
  slug: string;
  title: string;
  price: number;
  salePrice: number;
  color: string; // Bổ sung màu sắc
  size: string;
  image: string;
  quantity: number;
  isOutOfStock?: boolean;
}

export interface ShopState {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  cartItems: ICartItem[];

  // 2. CẬP NHẬT THAM SỐ: Thêm color vào các hàm xử lý
  addToCart: (item: ICartItem) => Promise<void>;
  removeFromCart: (productId: string, size: string, color: string) => Promise<void>;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => Promise<void>;
  setCart: (items: ICartItem[]) => void;
  clearCart: () => void;
}

// HÀM KIỂM TRA ĐĂNG NHẬP
const isAuthenticated = () => {
  const accessToken = useAuthStore.getState().accessToken;
  return accessToken ? accessToken : null;
};

export const useCartStore = create<ShopState>()(
  persist(
    (set) => ({
      openModal: false,
      setOpenModal: (open) => set({ openModal: open }),

      cartItems: [],

      // ACTION: Thêm vào giỏ
      addToCart: async (item) => {
        set((state) => {
          // QUAN TRỌNG: Phải so sánh trùng khớp cả ID, Size VÀ Màu sắc
          const existingItemIndex = state.cartItems.findIndex(
            (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
          );

          if (existingItemIndex !== -1) {
            const newCart = [...state.cartItems];
            newCart[existingItemIndex].quantity += item.quantity;
            return { cartItems: newCart };
          } else {
            return { cartItems: [...state.cartItems, item] };
          }
        });

        // Gọi API lên Backend
        if (isAuthenticated()) {
          try {
            await api.post(
              "/cart/add",
              {
                productId: item.productId,
                sku: item.sku,
                color: item.color, // Gửi màu sắc lên DB
                size: item.size,
                quantity: item.quantity,
              },
              {
                headers: {
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
      updateQuantity: async (productId, size, color, quantity) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.productId === productId && item.size === size && item.color === color
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));

        if (isAuthenticated()) {
          try {
            await api.patch(
              "/cart/update",
              { productId, size, color, quantity }, // Cập nhật có kèm color
              {
                headers: {
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
      removeFromCart: async (productId, size, color) => {
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => !(item.productId === productId && item.size === size && item.color === color)
          ),
        }));

        if (isAuthenticated()) {
          try {
            await api.patch(
              "/cart/remove", 
              { data: { productId, size, color } }, 
              {
                headers: {
                  Authorization: `Bearer ${isAuthenticated()}`,
                },
              }
            );
          } catch (error) {
            console.error("Lỗi xóa sản phẩm trên Server", error);
          }
        }
      },

      setCart: (items) => {
        set({ cartItems: items });
      },

      clearCart: () => {
        set({ cartItems: [] });
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        // Chỉ lưu các trường thiết yếu để phục hồi giỏ hàng
        // Bổ sung sku và color để khi Backend validate lại giá không bị nhầm variant
        cartItems: state.cartItems.map((item) => ({
          productId: item.productId,
          sku: item.sku,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
        })),
      }),
    }
  )
);