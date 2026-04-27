import { useEffect, useState } from "react";
import Title from "../components/Title";
import { orderService } from "../services/orderService";
import { convertPrice } from "../utils/convertPrice";
import ReviewModal from "../components/ReviewModal";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const Order = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ productId: string, orderId: string } | null>(null);

  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await orderService.getMyOrdersService();
      console.log(res.data)
      setOrders(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách đơn hàng!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      if (accessToken) {
        fetchOrders();
      } else {
        setIsLoading(false);
      }
    }
  }, [isAuthLoading, accessToken]);

  const openReviewModal = (productId: string, orderId: string) => {
    setSelectedProduct({ productId, orderId });
    setIsModalOpen(true);
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Đang chờ xử lý';
      case 'processing': return 'Đang chuẩn bị hàng';
      case 'shipped': return 'Đang giao hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="border-t pt-10 sm:pt-16 pb-20">
      <div className="text-2xl sm:text-3xl mb-8">
        <Title title1={"LỊCH SỬ"} title2={"ĐƠN HÀNG"} />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-gray-100 p-6 rounded-2xl shadow-sm animate-pulse bg-gray-50 h-40"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 mb-4 text-lg">Bạn chưa có đơn hàng nào.</p>
          <Link 
            to="/collection" 
            className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium shadow-md shadow-black/20 hover:shadow-lg"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.map((order: any, index: number) => (
            <div key={index} className="bg-white border border-gray-100 p-5 sm:p-7 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-2xl transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-5 border-b border-gray-100 gap-4 sm:gap-0">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 tracking-wide text-lg">Mã đơn: #{order.orderCode}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Ngày đặt: <span className="text-gray-700 font-medium">{new Date(order.createdAt).toLocaleDateString("vi-VN", {day: '2-digit', month: '2-digit', year: 'numeric'})}</span></p>
                  </div>
                </div>
                
                <div className="flex flex-col items-start sm:items-end w-full sm:w-auto bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Tổng cộng:</span>
                    <p className="font-bold text-lg text-black">{convertPrice(order.totalAmount)}đ</p>
                  </div>
                  <div className={`mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    order.orderStatus === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                    order.orderStatus === 'cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                    'bg-blue-50 text-blue-600 border border-blue-200'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {getStatusText(order.orderStatus)}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="flex flex-col gap-5">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between group">
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="relative overflow-hidden rounded-xl bg-gray-100 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-20 h-24 sm:w-24 sm:h-28 object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      
                      <div className="flex flex-col justify-center h-full">
                        <Link to={`/product/${item.slug}`} className="font-semibold text-base sm:text-lg text-gray-900 hover:text-[#ff4500] line-clamp-2 transition-colors mb-2">
                          {item.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <span className="font-medium text-black bg-gray-100 px-2.5 py-1 rounded-md">{convertPrice(item.salePrice)}đ</span>
                          <span className="flex items-center gap-1"><span className="text-gray-400">SL:</span> <span className="font-medium text-gray-900">{item.quantity}</span></span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="flex items-center gap-1"><span className="text-gray-400">Size:</span> <span className="font-medium text-gray-900">{item.size}</span></span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="flex items-center gap-1"><span className="text-gray-400">Màu:</span> <span className="font-medium text-gray-900">{item.color}</span></span>
                        </div>
                      </div>
                    </div>
                    
                    {order.orderStatus === 'delivered' && (
                      <div className="w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0">
                        {item.isReviewed ? (
                          <div className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Đã đánh giá
                          </div>
                        ) : (
                          <button 
                            onClick={() => openReviewModal(item.productId, order._id)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-black bg-white text-black px-6 py-2.5 text-sm font-semibold rounded-full hover:bg-black hover:text-white transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:scale-95 whitespace-nowrap"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Đánh giá
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ReviewModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productId={selectedProduct.productId}
          orderId={selectedProduct.orderId}
          onReviewSuccess={() => {
            fetchOrders();
          }}
        />
      )}
    </div>
  );
};

export default Order;