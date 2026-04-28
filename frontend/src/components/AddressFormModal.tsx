import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  userServices,
  type IAddressPayload,
  type IAddress,
} from "../services/userService";
import DropdownAddress from "./DropdownAddress/DropdownAddress";

// IMPORT ZUSTAND STORE CỦA BẠN VÀO ĐÂY (Nhớ sửa lại đường dẫn cho đúng)
import { useCheckoutInforStore } from "../stores/useCheckoutInforStore"; 

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IAddress | null;
  onSuccess: (addresses: IAddress[]) => void;
  accessToken: string;
}

const EMPTY_FORM = {
  name: "",
  phone: "",
  address: "",
};

type FormErrors = {
  name?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
};

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
  accessToken,
}) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // CHỈ LƯU CODE - Đã xóa toàn bộ provinceName, districtName, wardName
  const [provinceCode, setProvinceCode] = useState<string | number>("");
  const [districtCode, setDistrictCode] = useState<string | number>("");
  const [wardCode, setWardCode] = useState<string | number>("");

  // Gọi hàm setField từ Zustand Store
  const setCheckoutField = useCheckoutInforStore((state) => state.setField);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData && isOpen) {
      setForm({
        name: initialData.name,
        phone: initialData.phone,
        address: initialData.address,
      });
      // Gán thẳng Code vào để Dropdown tự động map ra tên hiển thị
      setProvinceCode(initialData.province);
      setDistrictCode(initialData.district);
      setWardCode(initialData.ward);
    } else if (isOpen) {
      setForm(EMPTY_FORM);
      setProvinceCode("");
      setDistrictCode("");
      setWardCode("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChangeText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Vui lòng nhập tên người nhận!";
    if (!/^(0|\+84)[0-9]{9}$/.test(form.phone))
      errs.phone = "Số điện thoại không hợp lệ!";
      
    // Validate dựa trên Code thay vì Name
    if (!provinceCode) errs.province = "Vui lòng chọn Tỉnh/Thành phố!";
    if (!districtCode) errs.district = "Vui lòng chọn Quận/Huyện!";
    if (!wardCode) errs.ward = "Vui lòng chọn Phường/Xã!";
    if (!form.address.trim()) errs.address = "Vui lòng nhập địa chỉ chi tiết!";
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Payload giờ chỉ gửi lên Code dưới dạng String
    const payload: IAddressPayload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      province: String(provinceCode),
      district: String(districtCode),
      ward: String(wardCode),
      address: form.address.trim(),
    };

    try {
      setIsLoading(true);
      let res;
      if (isEditMode && initialData) {
        res = await userServices.updateAddress(
          accessToken,
          initialData._id,
          payload
        );
      } else {
        res = await userServices.addAddress(accessToken, payload);
      }

      const addressesList: IAddress[] = res.data.data; // Danh sách địa chỉ mới nhất

      // 🌟 LOGIC LƯU LOCAL STORAGE: Tìm xem trong list có cái nào đang là Default không
      const defaultAddress = addressesList.find((addr) => addr.isDefault === true);
      if (defaultAddress) {
        setCheckoutField("fullName", defaultAddress.name);
        setCheckoutField("phone", defaultAddress.phone);
        setCheckoutField("province", String(defaultAddress.province));
        setCheckoutField("district", String(defaultAddress.district));
        setCheckoutField("ward", String(defaultAddress.ward));
        setCheckoutField("detailAddress", defaultAddress.address);
      }

      toast.success(
        isEditMode ? "Cập nhật địa chỉ thành công!" : "Thêm địa chỉ thành công!"
      );
      onSuccess(addressesList);
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Đã sửa class z-100 thành z-[100]
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        .addr-modal * { font-family: 'Manrope', sans-serif; }
        @keyframes addrSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .addr-panel { animation: addrSlideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
      `}</style>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="addr-modal addr-panel relative z-10 bg-white w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* ... Header giữ nguyên ... */}
        <div className="h-0.5 bg-[#1a1a1a] w-full" />
        <div className="px-6 py-5 flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca3af] mb-1">
              {isEditMode ? "Chỉnh sửa" : "Thêm mới"}
            </p>
            <h2 className="text-xl font-bold text-[#1a1a1a] tracking-tight">
              {isEditMode ? "Cập nhật địa chỉ" : "Địa chỉ giao hàng"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center text-[#9ca3af] hover:text-[#1a1a1a] hover:bg-[#f3f4f6] transition-colors -mt-0.5 -mr-1 disabled:opacity-40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="h-px bg-[#f3f4f6]" />

        {/* Form Body */}
        <div className="overflow-y-auto flex-1">
          <form
            id="addr-form"
            onSubmit={handleSubmit}
            className="p-6 space-y-5"
          >
            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b7280] mb-2">
                Họ và tên người nhận <span className="text-rose-500">*</span>
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChangeText}
                placeholder="Nguyễn Văn A"
                className={`w-full px-4 py-3 border text-sm text-[#1a1a1a] placeholder:text-[#d1d5db] focus:outline-none focus:border-[#1a1a1a] transition-colors ${
                  errors.name ? "border-rose-400 bg-rose-50" : "border-[#e5e7eb]"
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b7280] mb-2">
                Số điện thoại <span className="text-rose-500">*</span>
              </label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChangeText}
                placeholder="0912 345 678"
                className={`w-full px-4 py-3 border text-sm text-[#1a1a1a] placeholder:text-[#d1d5db] focus:outline-none focus:border-[#1a1a1a] transition-colors ${
                  errors.phone ? "border-rose-400 bg-rose-50" : "border-[#e5e7eb]"
                }`}
              />
              {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
            </div>

            {/* Dropdown Khu vực */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b7280] mb-3">
                Khu vực giao hàng <span className="text-rose-500">*</span>
              </p>

              <DropdownAddress
                province={provinceCode}
                district={districtCode}
                ward={wardCode}
                
                // Dropdown giờ chỉ nhận Code, bỏ qua tham số Name
                onChangeProvince={(code) => {
                  setProvinceCode(code);
                  setErrors((prev) => ({ ...prev, province: undefined }));
                }}
                onChangeDistrict={(code) => {
                  setDistrictCode(code);
                  setErrors((prev) => ({ ...prev, district: undefined }));
                }}
                onChangeWard={(code) => {
                  setWardCode(code);
                  setErrors((prev) => ({ ...prev, ward: undefined }));
                }}
                
                errors={{
                  province: errors.province,
                  district: errors.district,
                  ward: errors.ward,
                }}
              />
            </div>

            {/* Detail address */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b7280] mb-2">
                Địa chỉ chi tiết <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="address"
                rows={2}
                value={form.address}
                onChange={handleChangeText}
                placeholder="Số nhà, tên đường, tòa nhà, căn hộ..."
                className={`w-full px-4 py-3 border text-sm text-[#1a1a1a] placeholder:text-[#d1d5db] focus:outline-none focus:border-[#1a1a1a] resize-none transition-colors ${
                  errors.address ? "border-rose-400 bg-rose-50" : "border-[#e5e7eb]"
                }`}
              />
              {errors.address && <p className="mt-1 text-xs text-rose-500">{errors.address}</p>}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e5e7eb] px-6 py-4 bg-[#fafafa] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af] hover:text-[#1a1a1a] transition-colors disabled:opacity-40"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="addr-form"
            disabled={isLoading}
            className="bg-[#1a1a1a] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang lưu...
              </>
            ) : isEditMode ? "Lưu thay đổi" : "Thêm địa chỉ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressFormModal;