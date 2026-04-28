import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Tách riêng các trường dữ liệu (State)
interface CheckoutState {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  note: string; 
  paymentMethod: string;
}

// 2. Tách riêng các hàm xử lý (Actions)
interface CheckoutActions {
  // Ràng buộc Type: Tham số 'field' CHỈ ĐƯỢC PHÉP là các key trong CheckoutState
  setField: <K extends keyof CheckoutState>(field: K, value: CheckoutState[K]) => void;
  resetAddress: () => void;
}

// Gộp chung lại thành ICheckoutInfo
type ICheckoutInfo = CheckoutState & CheckoutActions;

// Khởi tạo State mặc định để dùng lại nhiều lần cho gọn
const initialState: CheckoutState = {
  fullName: "",
  email: "",
  phone: "",
  province: "",
  district: "",
  ward: "",
  detailAddress: "",
  note: "",
  paymentMethod: "cod",
};

// 3. Khởi tạo Store với create<ICheckoutInfo>()(...)
export const useCheckoutInforStore = create<ICheckoutInfo>()(
  persist(
    (set) => ({
      ...initialState, // Rải dữ liệu mặc định vào đây

      // Cập nhật 1 trường bất kỳ
      setField: (field, value) => 
        set((state) => ({ 
          ...state, 
          [field]: value 
        })),

      // Reset toàn bộ form về trống
      resetAddress: () => set(initialState),
    }),
    {
      name: "checkout-info-storage", // Bắt buộc phải có name khi dùng persist (lưu vào localStorage)
      partialize: (state) => ({ ...state }) // (Tuỳ chọn) Nếu bạn muốn bỏ hàm ra khỏi localStorage
    }
  )
);