import { useEffect } from "react";
import { PAYMENT_METHOD } from "../../constants/payment";
import DropdownAddress from "../DropdownAddress/DropdownAddress";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  checkoutInfoSchema,
  type CheckoutInfoValue,
} from "../../validators/checkoutInforStore.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckoutInforStore } from "../../stores/useCheckoutInforStore";
import { useAuthStore } from "../../stores/useAuthStore"; // Import thêm AuthStore
import ErrorMessage from "../errorMessage/ErrorMessage";
import { getInputClassName } from "../../utils/getInputClassName";

const FormCheckoutInfo = ({
  onSubmitSuccess,
}: {
  onSubmitSuccess: (data: CheckoutInfoValue) => void;
}) => {
  // Lấy thông tin user đang đăng nhập
  const currentUser = useAuthStore((s) => s.user); 

  // Lấy thông tin đã lưu trong localStorage
  const storedFullName = useCheckoutInforStore((s) => s.fullName);
  const storedEmail = useCheckoutInforStore((s) => s.email);
  const storedPhone = useCheckoutInforStore((s) => s.phone);
  const province = useCheckoutInforStore((s) => s.province);
  const district = useCheckoutInforStore((s) => s.district);
  const ward = useCheckoutInforStore((s) => s.ward);
  const detailAddress = useCheckoutInforStore((s) => s.detailAddress);
  const note = useCheckoutInforStore((s) => s.note);
  const paymentMethod = useCheckoutInforStore((s) => s.paymentMethod);

  const setField = useCheckoutInforStore((s) => s.setField);

  // Ưu tiên thông tin cá nhân từ tài khoản đăng nhập, fallback về localStorage
  const fullName = currentUser?.fullName || storedFullName;
  const email = currentUser?.email || storedEmail;
  const phone = currentUser?.phone || storedPhone;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutInfoValue>({
    resolver: zodResolver(checkoutInfoSchema),
    defaultValues: {
      fullName,
      email,
      phone,
      province,
      district,
      ward,
      detailAddress,
      note,
      paymentMethod,
    },
  });

  // Khi user đăng nhập/đăng xuất: đồng bộ thông tin cá nhân vào form và localStorage
  useEffect(() => {
    if (currentUser) {
      // Đăng nhập: ghi đè form + localStorage bằng thông tin tài khoản
      if (currentUser.fullName) {
        setValue("fullName", currentUser.fullName);
        setField("fullName", currentUser.fullName);
      }
      if (currentUser.email) {
        setValue("email", currentUser.email);
        setField("email", currentUser.email);
      }
      if (currentUser.phone) {
        setValue("phone", currentUser.phone);
        setField("phone", currentUser.phone);
      }
    } else {
      // Đăng xuất: xóa thông tin cá nhân cũ để tránh dữ liệu "dính"
      setValue("fullName", "");
      setField("fullName", "");
      setValue("email", "");
      setField("email", "");
      setValue("phone", "");
      setField("phone", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const formChangeValue = watch();

  useEffect(() => {
    if (formChangeValue.fullName !== undefined) setField("fullName", formChangeValue.fullName);
    if (formChangeValue.email !== undefined) setField("email", formChangeValue.email);
    if (formChangeValue.phone !== undefined) setField("phone", formChangeValue.phone);
    if (formChangeValue.province !== undefined) setField("province", formChangeValue.province);
    if (formChangeValue.district !== undefined) setField("district", formChangeValue.district);
    if (formChangeValue.ward !== undefined) setField("ward", formChangeValue.ward);
    if (formChangeValue.detailAddress !== undefined) setField("detailAddress", formChangeValue.detailAddress);
    if (formChangeValue.note !== undefined) setField("note", formChangeValue.note);
    if (formChangeValue.paymentMethod !== undefined) setField("paymentMethod", formChangeValue.paymentMethod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formChangeValue]);

  const onSubmitForm: SubmitHandler<CheckoutInfoValue> = (data) => {
    onSubmitSuccess(data);
  };

  return (
    <form
      className="flex flex-col lg:col-span-3 order-2 lg:order-1 font-manrope"
      id="checkout-info-form"
      onSubmit={handleSubmit(onSubmitForm)}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Manrope', sans-serif; }
      `}</style>

      {/* THÔNG TIN GIAO HÀNG */}
      <div className="w-full">
        <h1 className="font-semibold text-xl sm:text-2xl mb-6 text-[#1a1a1a] tracking-tight">
          THÔNG TIN GIAO HÀNG
        </h1>
        
        {/* Họ tên */}
        <div className="w-full mb-5">
          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b7280] mb-2">
            Họ và tên người nhận <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ví dụ: Nguyễn Văn A"
            {...register("fullName")}
            className={`${getInputClassName(!!errors.fullName)} w-full py-3 ${currentUser?.fullName ? 'bg-gray-50' : ''}`}
            defaultValue={fullName}
          />
          <ErrorMessage message={errors.fullName?.message} />
        </div>

        {/* Cụm Email & SĐT */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-5 mb-5">
          <div className="w-full">
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b7280] mb-2">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: email@domain.com"
              {...register("email")}
              className={`${getInputClassName(!!errors.email)} w-full py-3 ${currentUser?.email ? 'bg-gray-50' : ''}`}
              defaultValue={email}
            />
            <ErrorMessage message={errors.email?.message} />
          </div>
          <div className="w-full">
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b7280] mb-2">
              Số điện thoại <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="0912 345 678"
              {...register("phone")}
              className={`${getInputClassName(!!errors.phone)} w-full py-3 ${currentUser?.phone ? 'bg-gray-50' : ''}`}
              defaultValue={phone}
            />
            <ErrorMessage message={errors.phone?.message} />
          </div>
        </div>

        {/* Chọn Tỉnh/Quận/Phường */}
        <div className="mb-5">
          {/* Label tổng cho khu vực đã được bỏ vì bên trong DropdownAddress bạn đã tách Label từng ô theo dòng rồi */}
          <DropdownAddress
            province={formChangeValue.province}
            district={formChangeValue.district}
            ward={formChangeValue.ward}
            onChangeProvince={(val) =>
              setValue("province", val.toString(), { shouldValidate: true })
            }
            onChangeDistrict={(val) =>
              setValue("district", val.toString(), { shouldValidate: true })
            }
            onChangeWard={(val) =>
              setValue("ward", val.toString(), { shouldValidate: true })
            }
            errors={{
              province: errors.province?.message,
              district: errors.district?.message,
              ward: errors.ward?.message,
            }}
          />
        </div>

        {/* Địa chỉ chi tiết */}
        <div className="w-full mb-5">
          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b7280] mb-2">
            Địa chỉ chi tiết <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Số nhà, tên đường, tòa nhà, căn hộ..."
            {...register("detailAddress")}
            className={`${getInputClassName(!!errors.detailAddress)} w-full py-3`}
            defaultValue={detailAddress}
          />
          <ErrorMessage message={errors.detailAddress?.message} />
        </div>

        {/* Ghi chú */}
        <div className="w-full mb-8">
          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b7280] mb-2">
            Ghi chú đơn hàng
          </label>
          <textarea
            {...register("note")}
            placeholder="Ví dụ: Giao trong giờ hành chính, gọi trước khi giao..."
            className="outline-none py-3 px-4 border border-gray-300 hover:border-gray-400 focus:border-gray-800 w-full rounded min-h-[100px] transition-all duration-200 resize-y text-sm placeholder:text-gray-400"
          ></textarea>
        </div>
      </div>

      {/* PHƯƠNG THỨC THANH TOÁN */}
      <div className="w-full mt-2 border-t border-gray-200 pt-8">
        <h1 className="font-semibold text-xl sm:text-2xl mb-5 text-[#1a1a1a] tracking-tight">
          PHƯƠNG THỨC THANH TOÁN
        </h1>
        {PAYMENT_METHOD.map((payment) => {
          const isChecked: boolean = payment.id === paymentMethod;
          return (
            <label
              htmlFor={payment.id}
              key={payment.id}
              className={`w-full flex items-center gap-4 border rounded-lg px-5 py-4 mb-3 cursor-pointer transition-all duration-200 ${
                isChecked
                  ? "bg-gray-50 border-gray-800 shadow-sm ring-1 ring-gray-800"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50/50"
              }`}
            >
              <input
                type="radio"
                id={payment.id}
                value={payment.id}
                {...register("paymentMethod")}
                className="w-4 h-4 text-black focus:ring-black accent-black cursor-pointer"
              />
              <img
                src={payment.image}
                alt={payment.title}
                className="w-10 h-10 object-contain"
              />
              <p className="text-sm sm:text-base font-medium text-gray-800">{payment.title}</p>
            </label>
          );
        })}
        {/* Validation cho phương thức thanh toán nếu cần */}
        {errors.paymentMethod && <ErrorMessage message={errors.paymentMethod?.message} />}
      </div>
    </form>
  );
};

export default FormCheckoutInfo;