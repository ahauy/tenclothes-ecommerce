import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { orderService } from '../../services/orderService';
import { convertPrice } from '../../utils/convertPrice';
import ReviewModal from '../../components/ReviewModal';
import { useAuthStore } from '../../stores/useAuthStore';
import api from '../../utils/axios';
import { useCartStore } from '../../stores/useCartStore';
import axios from 'axios';
import type { IJsonFail } from '../../interfaces/iAuthState';

// ---- Types ----
interface OrderItem {
  productId: string;
  sku: string;
  slug: string;
  title: string;
  price: number;
  salePrice: number;
  color: string;
  size: string;
  image: string;
  quantity: number;
  isReviewed?: boolean;
}

interface Order {
  _id: string;
  orderCode: string;
  createdAt: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  totalAmount: number;
  items: OrderItem[];
  customer: {
    fullName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    detailAddress: string;
    paymentMethod: string;
  };
  cancelReason?: string | null;
}

// ---- Status config ----
type StatusKey = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_CONFIG: Record<
  Exclude<StatusKey, 'all'>,
  { label: string; badgeClass: string; dotClass: string }
> = {
  pending: {
    label: 'Đang chờ xử lý',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
    dotClass: 'bg-amber-500',
  },
  processing: {
    label: 'Đang chuẩn bị',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
    dotClass: 'bg-blue-500',
  },
  shipped: {
    label: 'Đang giao hàng',
    badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    dotClass: 'bg-indigo-500',
  },
  delivered: {
    label: 'Đã giao hàng',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Đã hủy',
    badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
    dotClass: 'bg-rose-500',
  },
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  banking: 'Chuyển khoản ngân hàng',
  momo: 'Ví MoMo',
};

// ---- Tab filters ----
const TABS: { key: StatusKey; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xử lý' },
  { key: 'processing', label: 'Chuẩn bị' },
  { key: 'shipped', label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã hủy' },
];

// ---- Skeleton ----
const OrderSkeleton: React.FC = () => (
  <div className="bg-white border border-[#e5e7eb] p-6 sm:p-8 animate-pulse">
    <div className="flex justify-between items-start mb-6 pb-5 border-b border-[#f3f4f6]">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-[#f3f4f6] rounded" />
        <div className="h-3 w-48 bg-[#f3f4f6] rounded" />
      </div>
      <div className="h-6 w-24 bg-[#f3f4f6] rounded-full" />
    </div>
    <div className="flex gap-4 items-center">
      <div className="w-20 h-24 bg-[#f3f4f6] shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-[#f3f4f6] rounded" />
        <div className="h-3 w-1/2 bg-[#f3f4f6] rounded" />
      </div>
    </div>
  </div>
);

// ---- Status Badge ----
const StatusBadge: React.FC<{ status: Exclude<StatusKey, 'all'> }> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider ${config.badgeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
};

// ---- Empty State ----
const EmptyState: React.FC<{ filtered: boolean }> = ({ filtered }) => (
  <div className="bg-white border border-[#e5e7eb] p-12 sm:p-16 text-center">
    <div className="w-16 h-16 bg-[#f7f8fa] border border-[#e5e7eb] flex items-center justify-center mx-auto mb-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-[#9ca3af]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    </div>
    <p className="text-[#1a1a1a] font-medium text-lg mb-2">
      {filtered ? 'Không có đơn hàng nào ở trạng thái này' : 'Bạn chưa có đơn hàng nào'}
    </p>
    <p className="text-[#9ca3af] text-sm mb-8">
      {filtered
        ? 'Thử chọn tab khác để xem đơn hàng.'
        : 'Hãy khám phá bộ sưu tập của chúng tôi và đặt đơn hàng đầu tiên.'}
    </p>
    {!filtered && (
      <Link
        to="/collection"
        className="inline-block bg-[#1a1a1a] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 hover:bg-[#333] transition-colors"
      >
        Mua sắm ngay
      </Link>
    )}
  </div>
);

// ---- Main Component ----
const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<StatusKey>('all');

  // ReviewModal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: string;
    orderId: string;
    productTitle: string;
  } | null>(null);

  // Cancel Order Modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState<Order | null>(null);
  const [cancelReasonOption, setCancelReasonOption] = useState<string>("Muốn thay đổi địa chỉ nhận hàng");
  const [customCancelReason, setCustomCancelReason] = useState<string>("");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  const [isRepurchasing, setIsRepurchasing] = useState<Record<string, boolean>>({});

  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const handleCancelOrder = async () => {
    if (!selectedOrderToCancel) return;
    
    const finalReason = cancelReasonOption === "Lý do khác" 
      ? customCancelReason.trim() 
      : cancelReasonOption;

    if (!finalReason) {
      toast.warning("Vui lòng nhập lý do hủy đơn!");
      return;
    }

    try {
      setIsSubmittingCancel(true);
      const res = await orderService.cancelOrderService(selectedOrderToCancel.orderCode, finalReason);
      if (res.data.status) {
        toast.success("Hủy đơn hàng thành công!");
        setIsCancelModalOpen(false);
        setSelectedOrderToCancel(null);
        setCustomCancelReason("");
        fetchOrders();
      }
    } catch (error: unknown) {
      console.error(error);
      let msg = "Không thể hủy đơn hàng, vui lòng thử lại!";
      if (axios.isAxiosError<IJsonFail>(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      toast.error(msg);
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const handleRepurchase = async (orderCode: string) => {
    try {
      setIsRepurchasing(prev => ({ ...prev, [orderCode]: true }));
      const res = await orderService.repurchaseOrderService(orderCode);
      if (res.data.status) {
        toast.success("Đã thêm các sản phẩm vào giỏ hàng thành công!");
        const syncRes = await api.post(
          "/cart/sync",
          { items: [] },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        useCartStore.getState().setCart(syncRes.data.data);
      }
    } catch (error: unknown) {
      console.error(error);
      let msg = "Không thể mua lại đơn hàng, vui lòng thử lại!";
      if (axios.isAxiosError<IJsonFail>(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      toast.error(msg);
    } finally {
      setIsRepurchasing(prev => ({ ...prev, [orderCode]: false }));
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await orderService.getMyOrdersService();
      setOrders(res.data.data ?? []);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách đơn hàng, vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
      if (accessToken) {
        fetchOrders();
      } else {
        setIsLoading(false);
      }
    }
  }, [isAuthLoading, accessToken, fetchOrders]);

  const openReviewModal = (productId: string, orderId: string, productTitle: string) => {
    setSelectedProduct({ productId, orderId, productTitle });
    setIsModalOpen(true);
  };

  // Cập nhật isReviewed locally sau khi review thành công — không cần reload toàn bộ
  const handleReviewSuccess = () => {
    if (!selectedProduct) return;
    setOrders((prev) =>
      prev.map((order) => {
        if (order._id !== selectedProduct.orderId) return order;
        return {
          ...order,
          items: order.items.map((item) =>
            item.productId === selectedProduct.productId
              ? { ...item, isReviewed: true }
              : item
          ),
        };
      })
    );
  };

  // Lọc đơn hàng theo tab đang chọn
  const filteredOrders =
    activeTab === 'all' ? orders : orders.filter((o) => o.orderStatus === activeTab);

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-manrope">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Manrope', sans-serif; }

        .card-hover { transition: box-shadow 0.3s ease; }
        .card-hover:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.06); }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-delay-1 { animation-delay: 0.05s; opacity: 0; }
        .animate-delay-2 { animation-delay: 0.1s; opacity: 0; }
        .animate-delay-3 { animation-delay: 0.15s; opacity: 0; }
        .animate-delay-4 { animation-delay: 0.2s; opacity: 0; }
        .animate-delay-5 { animation-delay: 0.25s; opacity: 0; }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Header */}
        <div className="animate-fade-in-up mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#1a1a1a] tracking-tight">
            Lịch Sử Đơn Hàng
          </h1>
          <p className="mt-2 text-[#8a8f98] text-sm sm:text-base">
            Xem và theo dõi tất cả đơn hàng của bạn.
          </p>
          <div className="mt-6 h-px bg-[#e5e7eb]" />
        </div>

        {/* Tabs */}
        <div className="animate-fade-in-up mb-6">
          <div className="flex gap-0 overflow-x-auto border border-[#e5e7eb] bg-white">
            {TABS.map((tab) => {
              const count =
                tab.key === 'all'
                  ? orders.length
                  : orders.filter((o) => o.orderStatus === tab.key).length;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex-shrink-0 px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-all duration-200 whitespace-nowrap
                    ${
                      activeTab === tab.key
                        ? 'bg-[#1a1a1a] text-white'
                        : 'text-[#6b7280] hover:text-[#1a1a1a] hover:bg-[#f7f8fa]'
                    }
                  `}
                >
                  {tab.label}
                  {count > 0 && (
                    <span
                      className={`ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full ${
                        activeTab === tab.key
                          ? 'bg-white text-[#1a1a1a]'
                          : 'bg-[#f3f4f6] text-[#6b7280]'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <OrderSkeleton key={n} />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState filtered={activeTab !== 'all'} />
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <article
                key={order._id}
                className={`bg-white border border-[#e5e7eb] card-hover animate-fade-in-up animate-delay-${Math.min(index + 1, 5)}`}
              >
                {/* Order Header */}
                <div className="px-6 sm:px-8 py-5 border-b border-[#f3f4f6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#f7f8fa] border border-[#e5e7eb] p-2.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#6b7280]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af] mb-0.5">
                        Đơn hàng #{order.orderCode}
                      </p>
                      <p className="text-sm text-[#6b7280]">
                        Ngày đặt:{' '}
                        <span className="text-[#1a1a1a] font-medium">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </span>
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={order.orderStatus} />
                </div>

                {order.orderStatus === 'cancelled' && order.cancelReason && (
                  <div className="mx-6 sm:mx-8 mt-4 px-4 py-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-start gap-2.5">
                    <svg className="w-4.5 h-4.5 shrink-0 mt-0.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-semibold uppercase tracking-wider mb-0.5 text-rose-800">Đơn hàng đã bị hủy</p>
                      <p className="text-rose-600">Lý do: {order.cancelReason}</p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="px-6 sm:px-8 py-6 space-y-5">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-between group"
                    >
                      {/* Product Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-[72px] h-[88px] bg-[#f7f8fa] border border-[#e5e7eb] shrink-0 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.slug}`}
                            className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wider line-clamp-2 hover:text-[#555] transition-colors"
                          >
                            {item.title}
                          </Link>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                            <span className="text-xs text-[#9ca3af]">
                              Size: <span className="text-[#1a1a1a] font-medium">{item.size}</span>
                            </span>
                            <span className="w-1 h-1 bg-[#d1d5db] rounded-full" />
                            <span className="text-xs text-[#9ca3af]">
                              Màu: <span className="text-[#1a1a1a] font-medium">{item.color}</span>
                            </span>
                            <span className="w-1 h-1 bg-[#d1d5db] rounded-full" />
                            <span className="text-xs text-[#9ca3af]">
                              SL: <span className="text-[#1a1a1a] font-medium">{item.quantity}</span>
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-[#1a1a1a] mt-2">
                            {convertPrice(item.salePrice)}đ
                          </p>
                        </div>
                      </div>

                      {/* Review Button — chỉ hiện với đơn đã giao */}
                      {order.orderStatus === 'delivered' && (
                        <div className="w-full sm:w-auto shrink-0 ml-0 sm:ml-4">
                          {item.isReviewed ? (
                            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold uppercase tracking-wider">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Đã đánh giá
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                openReviewModal(item.productId, order._id, item.title)
                              }
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#1a1a1a] bg-white text-[#1a1a1a] text-xs font-semibold uppercase tracking-widest px-5 py-2.5 hover:bg-[#1a1a1a] hover:text-white transition-all duration-200"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                              Viết đánh giá
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="px-6 sm:px-8 py-4 bg-[#f7f8fa] border-t border-[#e5e7eb] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="text-xs text-[#9ca3af] space-y-0.5">
                    <p>
                      Địa chỉ:{' '}
                      <span className="text-[#6b7280]">
                        {order.customer.detailAddress}, {order.customer.ward},{' '}
                        {order.customer.district}, {order.customer.province}
                      </span>
                    </p>
                    <p>
                      Thanh toán:{' '}
                      <span className="text-[#6b7280]">
                        {PAYMENT_METHOD_LABEL[order.customer.paymentMethod] ??
                          order.customer.paymentMethod}
                      </span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-[#9ca3af] uppercase tracking-widest mb-1">
                      Tổng cộng
                    </p>
                    <p className="text-xl font-semibold text-[#1a1a1a]">
                      {convertPrice(order.totalAmount)}đ
                    </p>
                  </div>
                </div>

                {/* Order Actions */}
                {((order.orderStatus === 'pending' || order.orderStatus === 'processing') ||
                  (order.orderStatus === 'cancelled' || order.orderStatus === 'delivered' || order.orderStatus === 'shipped')) && (
                  <div className="px-6 sm:px-8 py-3.5 bg-white border-t border-[#e5e7eb] flex justify-end gap-3 flex-wrap">
                    {/* Hủy đơn hàng */}
                    {(order.orderStatus === 'pending' || order.orderStatus === 'processing') && (
                      <button
                        onClick={() => {
                          setSelectedOrderToCancel(order);
                          setIsCancelModalOpen(true);
                        }}
                        className="text-xs font-semibold uppercase tracking-widest px-5 py-2.5 border border-[#e5e7eb] text-[#6b7280] hover:text-[#1a1a1a] hover:bg-[#f7f8fa] transition-all duration-200 cursor-pointer"
                      >
                        Hủy Đơn Hàng
                      </button>
                    )}
                    
                    {/* Mua lại */}
                    {(order.orderStatus === 'cancelled' || order.orderStatus === 'delivered' || order.orderStatus === 'shipped') && (
                      <button
                        onClick={() => handleRepurchase(order.orderCode)}
                        disabled={isRepurchasing[order.orderCode]}
                        className="bg-[#1a1a1a] text-white text-xs font-semibold uppercase tracking-widest px-5 py-2.5 hover:bg-[#333] transition-all duration-200 disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                      >
                        {isRepurchasing[order.orderCode] ? (
                          <>
                            <svg className="w-3.5 h-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Đang xử lý...
                          </>
                        ) : (
                          "Mua Lại"
                        )}
                      </button>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="h-8" />
      </div>

      {/* Review Modal */}
      {selectedProduct && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          productId={selectedProduct.productId}
          orderId={selectedProduct.orderId}
          onReviewSuccess={handleReviewSuccess}
        />
      )}

      {/* Cancel Order Modal */}
      {isCancelModalOpen && selectedOrderToCancel && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-[#e5e7eb] p-6 sm:p-8 space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-[#f3f4f6] pb-4">
              <h3 className="text-lg font-semibold text-[#1a1a1a] uppercase tracking-wider">
                Hủy Đơn Hàng #{selectedOrderToCancel.orderCode}
              </h3>
              <button
                onClick={() => {
                  setIsCancelModalOpen(false);
                  setSelectedOrderToCancel(null);
                  setCustomCancelReason("");
                }}
                className="text-[#9ca3af] hover:text-[#1a1a1a] transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
                Lý do hủy đơn hàng <span className="text-rose-500">*</span>
              </label>
              
              <div className="space-y-2">
                {[
                  "Muốn thay đổi địa chỉ nhận hàng",
                  "Muốn thay đổi sản phẩm (size, màu sắc, số lượng...)",
                  "Tìm thấy cửa hàng khác giá tốt hơn",
                  "Không có nhu cầu mua nữa",
                  "Lý do khác"
                ].map((reason) => (
                  <label key={reason} className="flex items-center gap-3 cursor-pointer group py-1">
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReasonOption === reason}
                      onChange={(e) => setCancelReasonOption(e.target.value)}
                      className="w-4 h-4 text-[#1a1a1a] border-[#d1d5db] focus:ring-[#1a1a1a] accent-[#1a1a1a] cursor-pointer"
                    />
                    <span className="text-sm text-[#374151] group-hover:text-[#1a1a1a] transition-colors">
                      {reason}
                    </span>
                  </label>
                ))}
              </div>

              {cancelReasonOption === "Lý do khác" && (
                <div className="mt-3">
                  <textarea
                    rows={3}
                    placeholder="Vui lòng nhập lý do cụ thể..."
                    value={customCancelReason}
                    onChange={(e) => setCustomCancelReason(e.target.value)}
                    className="w-full text-sm border border-[#d1d5db] p-3 focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none placeholder:text-[#9ca3af]"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 border-t border-[#f3f4f6] pt-5">
              <button
                disabled={isSubmittingCancel}
                onClick={() => {
                  setIsCancelModalOpen(false);
                  setSelectedOrderToCancel(null);
                  setCustomCancelReason("");
                }}
                className="flex-1 border border-[#e5e7eb] bg-white text-[#6b7280] text-xs font-semibold uppercase tracking-widest py-3 hover:bg-[#f7f8fa] hover:text-[#1a1a1a] transition-all duration-200 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                disabled={isSubmittingCancel || (cancelReasonOption === "Lý do khác" && !customCancelReason.trim())}
                onClick={handleCancelOrder}
                className="flex-1 bg-black text-white text-xs font-semibold uppercase tracking-widest py-3 hover:bg-[#333] transition-all duration-200 disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmittingCancel ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận hủy"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
