import React from "react";
import { X, User, MapPin, Package, CreditCard, Calendar as CalendarIcon, Phone, Mail, FileText, ImageIcon, Clock, CheckCircle, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { IOrderAdmin } from "../../interfaces/order.interface";
import { orderService } from "../../services/order.service";
import { toast } from "sonner";
import type { IJsonFail } from "../../interfaces/api.interface";
import OrderStatusDropdown from "./OrderStatusDropdown";
import CustomDropdown from "../UI/CustomDropdown";
import AddressName from "./AddressName";

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: IOrderAdmin | null;
  onUpdateSuccess?: () => void;
}

const paymentStatusOptions = [
  { label: "Chưa thanh toán", value: "unpaid", icon: <Clock className="w-3.5 h-3.5 text-amber-500" /> },
  { label: "Đã thanh toán", value: "paid", icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> },
  { label: "Đã hoàn tiền", value: "refunded", icon: <RefreshCcw className="w-3.5 h-3.5 text-red-500" /> },
];

const OrderDrawer: React.FC<OrderDrawerProps> = ({ isOpen, onClose, order: initialOrder, onUpdateSuccess }) => {
  const [order, setOrder] = React.useState<IOrderAdmin | null>(initialOrder);
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  const handleUpdateStatus = async (field: 'orderStatus' | 'paymentStatus', value: string) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      await orderService.updateOrderStatus(order._id, { [field]: value });
      toast.success("Cập nhật trạng thái thành công!");
      setOrder({ ...order, [field]: value });
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Cập nhật thất bại");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/10 backdrop-blur-[2px] z-[60]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed right-0 top-0 h-full w-full max-w-3xl bg-white shadow-[0_0_50px_rgba(0,0,0,0.08)] z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="px-10 py-8 border-b border-neutral-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-20">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] block">
                  Chi tiết đơn hàng
                </span>
                <h3 className="text-2xl font-light text-neutral-900 tracking-tight">
                  {order.orderCode}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-50 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12 pb-20">

              {/* Status Row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-neutral-50/50 border border-neutral-100 rounded-sm">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] block mb-2">Trạng thái đơn hàng</span>
                  <div className="flex items-center gap-2">
                    {/* Make wrapper disabled visually if updating */}
                    <div className={isUpdating ? "opacity-50 pointer-events-none" : ""}>
                      <OrderStatusDropdown
                        currentStatus={order.orderStatus}
                        onStatusChange={(status) => handleUpdateStatus('orderStatus', status)}
                      />
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-neutral-50/50 border border-neutral-100 rounded-sm">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] block mb-2">Trạng thái thanh toán</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className={`min-w-[150px] ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}>
                      <CustomDropdown
                        placeholder="Thanh toán"
                        options={paymentStatusOptions}
                        value={order.paymentStatus}
                        onChange={(val) => handleUpdateStatus('paymentStatus', val as string)}
                      />
                    </div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                      ({order.customer.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : order.customer.paymentMethod.toUpperCase()})
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                  <User className="w-4 h-4 text-neutral-900" />
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-900">
                    Thông tin khách hàng
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{order.customer.fullName}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-0.5">Người đặt</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{order.customer.email}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-0.5">Email</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{order.customer.phone}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-0.5">Số điện thoại</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-1">
                        <MapPin className="w-4 h-4 text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 leading-relaxed">
                          {order.customer.detailAddress},<br />
                          <AddressName 
                            wardCode={order.customer.ward} 
                            districtCode={order.customer.district} 
                            provinceCode={order.customer.province} 
                          />
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-1">Địa chỉ giao hàng</p>
                      </div>
                    </div>
                    {order.customer.note && (
                      <div className="flex items-start gap-3 pt-2">
                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-1">
                          <FileText className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-900 leading-relaxed">{order.customer.note}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600/70 mt-1">Ghi chú của khách</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Items */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                  <Package className="w-4 h-4 text-neutral-900" />
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-900">
                    Sản phẩm đã đặt ({order.items.length})
                  </h4>
                </div>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 border border-neutral-100 rounded-sm bg-neutral-50/30">
                      <div className="w-20 h-24 bg-neutral-100 rounded-sm overflow-hidden shrink-0 border border-neutral-200">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col py-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-sm font-medium text-neutral-900 line-clamp-1">{item.title}</h5>
                            <p className="text-xs text-neutral-500 mt-1 font-medium">{item.color} - {item.size}</p>
                            <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">SKU: {item.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-neutral-900">{item.salePrice?.toLocaleString()} đ</p>
                            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-1">x{item.quantity}</p>
                          </div>
                        </div>
                        <div className="mt-auto flex justify-end">
                          <p className="text-sm font-bold text-neutral-900 border-t border-neutral-100 pt-2 w-full text-right mt-2">
                            Thành tiền: {(item.salePrice * item.quantity)?.toLocaleString()} đ
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Order Summary */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                  <CreditCard className="w-4 h-4 text-neutral-900" />
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-900">
                    Thanh toán
                  </h4>
                </div>
                <div className="bg-neutral-50 p-6 rounded-sm border border-neutral-100 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500 font-medium">Tạm tính:</span>
                    <span className="font-medium text-neutral-900">{order.totalAmount?.toLocaleString()} đ</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-500 font-medium">Giảm giá {order.couponCode ? `(${order.couponCode})` : ""}:</span>
                      <span className="font-medium text-red-500">-{order.discountAmount?.toLocaleString()} đ</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-neutral-200/60 flex justify-between items-end">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Tổng cộng</span>
                    <span className="text-xl font-medium text-neutral-900">{order.finalAmount?.toLocaleString()} đ</span>
                  </div>
                </div>
              </section>

              {/* Footer Info */}
              <div className="pt-8 border-t border-neutral-100 flex items-center justify-between text-neutral-400 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Tạo lúc: {new Date(order.createdAt).toLocaleString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <span>Cập nhật lần cuối: {new Date(order.updatedAt).toLocaleString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderDrawer;
