import { useEffect } from "react";
import { PAYMENT_METHOD } from "../../constants/payment";
import DropdownAddress from "../DropdownAddress/DropdownAddress";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  checkoutInfoSchema,
  type CheckoutInfoValue,
} from "../../validators/checkoutInforStore.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckoutInforStore } from "../../stores/useAddressStore";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { getInputClassName } from "../../utils/getInputClassName";


const FormCheckoutInfo = ({
  onSubmitSuccess,
}: {
  onSubmitSuccess: (data: CheckoutInfoValue) => void;
}) => {
  const fullName = useCheckoutInforStore((s) => s.fullName);
  const email = useCheckoutInforStore((s) => s.email);
  const phone = useCheckoutInforStore((s) => s.phone);
  const province = useCheckoutInforStore((s) => s.province);
  const district = useCheckoutInforStore((s) => s.district);
  const ward = useCheckoutInforStore((s) => s.ward);
  const detailAddress = useCheckoutInforStore((s) => s.detailAddress);
  const note = useCheckoutInforStore((s) => s.note);
  const paymentMethod = useCheckoutInforStore((s) => s.paymentMethod);

  const setField = useCheckoutInforStore((s) => s.setField);

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

  const formChangeValue = watch();

  useEffect(() => {
    if (formChangeValue.fullName) setField("fullName", formChangeValue.fullName);
    if (formChangeValue.email) setField("email", formChangeValue.email);
    if (formChangeValue.phone) setField("phone", formChangeValue.phone);
    if (formChangeValue.province) setField("province", formChangeValue.province);
    if (formChangeValue.district) setField("district", formChangeValue.district);
    if (formChangeValue.ward) setField("ward", formChangeValue.ward);
    if (formChangeValue.detailAddress) setField("detailAddress", formChangeValue.detailAddress);
    if (formChangeValue.note) setField("note", formChangeValue.note);
    if (formChangeValue.paymentMethod) setField("paymentMethod", formChangeValue.paymentMethod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formChangeValue]);

  const onSubmitForm: SubmitHandler<CheckoutInfoValue> = (data) => {
    onSubmitSuccess(data);
  };

  return (
    <form
      className="flex flex-col lg:col-span-3 order-2 lg:order-1"
      id="checkout-info-form"
      onSubmit={handleSubmit(onSubmitForm)}
    >
      {/* THÔNG TIN GIAO HÀNG */}
      <div className="w-full">
        <h1 className="font-semibold text-xl sm:text-2xl mb-6">
          THÔNG TIN GIAO HÀNG
        </h1>
        
        <div className="w-full mb-4">
          <input
            type="text"
            placeholder="Họ và tên"
            {...register("fullName")}
            className={getInputClassName(!!errors.fullName)}
            defaultValue={fullName}
          />
          <ErrorMessage message={errors.fullName?.message} />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div className="w-full">
            <input
              type="text"
              placeholder="Email"
              {...register("email")}
              className={getInputClassName(!!errors.email)}
              defaultValue={email}
            />
            <ErrorMessage message={errors.email?.message} />
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="Số điện thoại"
              {...register("phone")}
              className={getInputClassName(!!errors.phone)}
              defaultValue={phone}
            />
            <ErrorMessage message={errors.phone?.message} />
          </div>
        </div>

        <div className="mb-4">
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

        <div className="w-full mb-4">
          <input
            type="text"
            placeholder="Địa chỉ chi tiết (Số nhà, tên đường...)"
            {...register("detailAddress")}
            className={getInputClassName(!!errors.detailAddress)}
            defaultValue={detailAddress}
          />
          <ErrorMessage message={errors.detailAddress?.message} />
        </div>

        <div className="w-full mb-6">
          <textarea
            {...register("note")}
            placeholder="Ghi chú thêm (cơ quan làm việc, giao trong giờ hành chính, ...)"
            className="outline-none py-3 px-3 border border-gray-300 hover:border-gray-400 focus:border-gray-800 w-full rounded min-h-25 transition-all duration-200 resize-y"
          ></textarea>
        </div>
      </div>

      {/* PHƯƠNG THỨC THANH TOÁN */}
      <div className="w-full mt-2">
        <h1 className="font-semibold text-xl sm:text-2xl mb-5">
          PHƯƠNG THỨC THANH TOÁN
        </h1>
        {PAYMENT_METHOD.map((payment) => {
          const isChecked: boolean = payment.id === paymentMethod;
          return (
            <label
              htmlFor={payment.id}
              key={payment.id}
              className={`w-full flex items-center gap-4 border rounded-lg px-4 py-3.5 mb-3 cursor-pointer transition-all duration-200 ${
                isChecked
                  ? "bg-gray-50 border-gray-800 shadow-sm"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50/50"
              }`}
            >
              <input
                type="radio"
                id={payment.id}
                defaultValue={payment.id}
                {...register("paymentMethod")}
                className="w-4 h-4 text-black focus:ring-black accent-black"
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
        <ErrorMessage message={errors.paymentMethod?.message} />
      </div>
    </form>
  );
};

export default FormCheckoutInfo;