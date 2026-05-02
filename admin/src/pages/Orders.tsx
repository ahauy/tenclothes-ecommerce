import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Check,
  Activity,
  X,
  CreditCard,
  Truck,
  User,
  ShoppingBag,
  MoreVertical,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { orderService } from "../services/order.service";
import type { IOrderAdmin } from "../interfaces/order.interface";
import { cn } from "../utils/cn";
import { toast } from "sonner";
import type { IJsonFail } from "../interfaces/api.interface";

interface DropdownProps {
  options: { label: string; value: any; icon?: React.ReactNode; color?: string }[];
  value: any;
  onChange: (value: any) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

const CustomDropdown: React.FC<DropdownProps> = ({ options, value, onChange, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative flex-1 sm:flex-none" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 bg-white border border-neutral-100 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 w-full justify-between group hover:border-neutral-900",
          isOpen && "border-neutral-900 shadow-sm"
        )}
      >
        <div className="flex items-center gap-2 text-neutral-900">
          {icon && <span className="text-neutral-400 group-hover:text-neutral-900 transition-colors">{icon}</span>}
          <span className={cn(selectedOption?.value !== "all" && value !== "desc" ? "text-neutral-900" : "text-neutral-400")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={cn("w-3 h-3 text-neutral-400 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute left-0 right-0 mt-2 bg-white border border-neutral-100 shadow-[0_15px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden min-w-[200px]"
          >
            <div className="max-h-64 overflow-y-auto py-2 custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-[9px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    {option.icon && <span className={cn("text-neutral-400 group-hover:text-neutral-900", option.color)}>{option.icon}</span>}
                    <span className={cn(value === option.value ? "text-neutral-900" : "text-neutral-500")}>
                      {option.label}
                    </span>
                  </div>
                  {value === option.value && <Check className="w-3 h-3 text-neutral-900" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<IOrderAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [orderStatus, setOrderStatus] = useState<string>("all");
  const [paymentStatus, setPaymentStatus] = useState<string>("all");
  const [dateSort, setDateSort] = useState<string>("desc");

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await orderService.getOrders({
        page,
        limit: 8,
        keyword: searchTerm,
        orderStatus: orderStatus !== "all" ? orderStatus : undefined,
        paymentStatus: paymentStatus !== "all" ? paymentStatus : undefined,
        sort: dateSort === "desc" ? "-createdAt" : "createdAt",
      });
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, searchTerm, orderStatus, paymentStatus, dateSort]);

  const resetFilters = () => {
    setSearchTerm("");
    setOrderStatus("all");
    setPaymentStatus("all");
    setDateSort("desc");
    setPage(1);
  };

  const statusOptions = [
    { label: "Tất cả trạng thái", value: "all", icon: <Activity className="w-3.5 h-3.5" /> },
    { label: "Chờ xử lý", value: "pending", icon: <Calendar className="w-3.5 h-3.5 text-amber-500" /> },
    { label: "Đang xử lý", value: "processing", icon: <Truck className="w-3.5 h-3.5 text-blue-500" /> },
    { label: "Đang giao", value: "shipped", icon: <Truck className="w-3.5 h-3.5 text-indigo-500" /> },
    { label: "Đã giao hàng", value: "delivered", icon: <Check className="w-3.5 h-3.5 text-green-500" /> },
    { label: "Đã hủy", value: "cancelled", icon: <X className="w-3.5 h-3.5 text-red-500" /> },
  ];

  const paymentOptions = [
    { label: "Tất cả thanh toán", value: "all", icon: <CreditCard className="w-3.5 h-3.5" /> },
    { label: "Chưa thanh toán", value: "unpaid", icon: <CreditCard className="w-3.5 h-3.5 text-amber-500" /> },
    { label: "Đã thanh toán", value: "paid", icon: <CreditCard className="w-3.5 h-3.5 text-green-500" /> },
    { label: "Đã hoàn tiền", value: "refunded", icon: <X className="w-3.5 h-3.5 text-neutral-400" /> },
  ];

  const sortOptions = [
    { label: "Mới nhất trước", value: "desc", icon: <Calendar className="w-3.5 h-3.5" /> },
    { label: "Cũ nhất trước", value: "asc", icon: <Calendar className="w-3.5 h-3.5 opacity-50" /> },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-50 text-amber-600 border-amber-100";
      case "processing": return "bg-blue-50 text-blue-600 border-blue-100";
      case "shipped": return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "delivered": return "bg-green-50 text-green-600 border-green-100";
      case "cancelled": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-neutral-50 text-neutral-600 border-neutral-100";
    }
  };

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-1000 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 w-full">
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-1 block">
            Order Fulfillment
          </span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight">
            Đơn hàng
          </h2>
          <p className="text-neutral-500 font-light text-xs mt-1 hidden md:block">
            Theo dõi, xử lý và quản lý lịch sử mua hàng của khách hàng.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto bg-white border border-neutral-100 p-1.5 shadow-sm">
           <div className="px-4 py-2 text-center">
             <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Tổng đơn</p>
             <p className="text-lg font-bold text-neutral-900 leading-none">1,284</p>
           </div>
           <div className="w-[1px] h-8 bg-neutral-100" />
           <div className="px-4 py-2 text-center">
             <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Doanh thu</p>
             <p className="text-lg font-bold text-neutral-900 leading-none">$42.5k</p>
           </div>
        </div>
      </div>

      {/* Fluid Filter Bar */}
      <div className="flex flex-col xl:flex-row gap-4 w-full">
        {/* Search */}
        <div className="flex-1 min-w-[280px] relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
          <input
            type="text"
            placeholder="TÌM THEO MÃ ĐƠN, TÊN, EMAIL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-neutral-100 pl-12 pr-4 py-3 text-[11px] font-medium tracking-wider outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-300 shadow-sm shadow-neutral-50"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full xl:w-auto">
          <CustomDropdown
            placeholder="Sắp xếp ngày"
            options={sortOptions}
            value={dateSort}
            onChange={setDateSort}
            icon={<Calendar className="w-3.5 h-3.5" />}
          />
          <CustomDropdown
            placeholder="Trạng thái đơn"
            options={statusOptions}
            value={orderStatus}
            onChange={setOrderStatus}
            icon={<Activity className="w-3.5 h-3.5" />}
          />
          <CustomDropdown
            placeholder="Thanh toán"
            options={paymentOptions}
            value={paymentStatus}
            onChange={setPaymentStatus}
            icon={<CreditCard className="w-3.5 h-3.5" />}
          />
          
          {/* Reset button */}
          {(searchTerm || dateSort !== "desc" || orderStatus !== "all" || paymentStatus !== "all") && (
            <button
              onClick={resetFilters}
              title="Xóa tất cả lọc"
              className="px-4 py-3 bg-neutral-50 border border-neutral-100 text-neutral-400 hover:text-red-500 hover:border-red-100 transition-all ml-auto lg:ml-0 shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Adaptive Orders Display */}
      <div className="w-full">
        {/* Mobile: Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-6 border border-neutral-100 animate-pulse h-56 shadow-sm" />
            ))
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={order._id}
                className="bg-white p-6 border border-neutral-100 shadow-sm space-y-5"
              >
                <div className="flex justify-between items-start border-b border-neutral-50 pb-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">#{order.orderCode}</p>
                    <p className="text-[9px] text-neutral-400 font-medium">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                  <span className={cn("px-2.5 py-1 text-[8px] font-black uppercase tracking-widest border", getStatusStyle(order.orderStatus))}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="flex gap-4">
                   <div className="w-12 h-12 bg-neutral-50 flex items-center justify-center border border-neutral-100 shrink-0">
                     <User className="w-5 h-5 text-neutral-300" />
                   </div>
                   <div className="min-w-0">
                     <p className="text-[10px] font-bold text-neutral-900 truncate uppercase">{order.customer.fullName}</p>
                     <p className="text-[9px] text-neutral-400 truncate tracking-tight">{order.customer.email}</p>
                   </div>
                </div>

                <div className="flex justify-between items-end pt-2">
                   <div className="space-y-1">
                     <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">Giá trị đơn</p>
                     <p className="text-sm font-bold text-neutral-900">${order.finalAmount?.toLocaleString()}</p>
                   </div>
                   <div className="flex gap-2">
                      <button className="p-2.5 border border-neutral-100 hover:bg-neutral-900 hover:text-white transition-all shadow-sm"><Eye className="w-4 h-4" /></button>
                      <button className="p-2.5 border border-neutral-100 hover:bg-red-500 hover:text-white transition-all text-red-400 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
             <div className="bg-white border border-neutral-100 p-20 text-center col-span-full">
                <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.4em]">Empty Registry</p>
             </div>
          )}
        </div>

        {/* Desktop: Table */}
        <div className="hidden lg:block bg-white border border-neutral-100 overflow-hidden shadow-sm shadow-neutral-100">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100">
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Đơn hàng</th>
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Khách hàng</th>
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Giá trị</th>
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-center">Thanh toán</th>
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-8 py-8 h-24 bg-neutral-50/10" />
                    </tr>
                  ))
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={order._id}
                      className="group hover:bg-neutral-50/30 transition-all duration-300"
                    >
                      <td className="px-8 py-6">
                         <div className="space-y-1">
                            <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest">#{order.orderCode}</p>
                            <p className="text-[9px] text-neutral-400 font-medium">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center text-[10px] font-serif italic text-neutral-600">
                               {order.customer.fullName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                               <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-tight truncate max-w-[150px]">{order.customer.fullName}</p>
                               <p className="text-[9px] text-neutral-400 truncate max-w-[150px]">{order.customer.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="space-y-1">
                            <p className="text-xs font-bold text-neutral-900">${order.finalAmount?.toLocaleString()}</p>
                            <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-tighter">{order.items.length} SẢN PHẨM</p>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className={cn("inline-block px-3 py-1.5 text-[8px] font-black uppercase tracking-widest border rounded-[1px]", getStatusStyle(order.orderStatus))}>
                            {order.orderStatus}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <div className="flex flex-col items-center gap-1.5">
                            <span className={cn("text-[8px] font-black uppercase tracking-widest", order.paymentStatus === "paid" ? "text-green-500" : "text-amber-500")}>
                               {order.paymentStatus}
                            </span>
                            <div className={cn("w-6 h-0.5 rounded-full", order.paymentStatus === "paid" ? "bg-green-200" : "bg-amber-200")} />
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex justify-end gap-2.5">
                            <button title="Xem chi tiết" className="p-2.5 hover:bg-neutral-900 hover:text-white transition-all border border-neutral-100 rounded-[2px] shadow-sm"><Eye className="w-4 h-4 stroke-[1.25]" /></button>
                            <button title="Xóa đơn hàng" className="p-2.5 hover:bg-red-600 hover:text-white transition-all border border-neutral-100 rounded-[2px] shadow-sm"><Trash2 className="w-4 h-4 stroke-[1.25]" /></button>
                         </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-40 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <ShoppingBag className="w-10 h-10 text-neutral-100" />
                        <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.4em]">Danh sách trống</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - Fluid */}
      <div className="px-8 py-8 bg-white border border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-6 w-full shadow-sm">
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest order-2 sm:order-1">
          Trang {page} / {totalPages}
        </p>
        <div className="flex gap-4 order-1 sm:order-2 w-full sm:w-auto">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex-1 sm:flex-none px-8 py-3 bg-white border border-neutral-100 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-900 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Trước
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex-1 sm:flex-none px-8 py-3 bg-white border border-neutral-100 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-900 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Sau <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
