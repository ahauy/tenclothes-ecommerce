import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
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
  DollarSign,
  TrendingUp,
  PackageCheck,
  AlertCircle,
  PackageX,
  BarChart3,
  Banknote,
  Clock,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { orderService } from "../services/order.service";
import type { IOrderAdmin, IOrderStats } from "../interfaces/order.interface";
import { cn } from "../utils/cn";
import { toast } from "sonner";
import type { IJsonFail } from "../interfaces/api.interface";
import CustomDropdown from "../components/UI/CustomDropdown";
import OrderDrawer from "../components/orders/OrderDrawer";
import AddressName from "../components/orders/AddressName";
import Pagination from "../components/UI/Pagination";
import OrderStatusDropdown from "../components/orders/OrderStatusDropdown";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<IOrderAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<IOrderAdmin | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchStatus, setBatchStatus] = useState<string>("");
  const [totalElements, setTotalElements] = useState(0);

  // Global stats (from API)
  const [globalStats, setGlobalStats] = useState<IOrderStats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<IOrderAdmin | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);

  // Filters State
  const [orderStatus, setOrderStatus] = useState<string>("all");
  const [paymentStatus, setPaymentStatus] = useState<string>("all");
  const [dateSort, setDateSort] = useState<string>("desc");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await orderService.getOrders({
        page,
        limit: 8,
        keyword: searchTerm,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        orderStatus: orderStatus !== "all" ? orderStatus : undefined,
        paymentStatus: paymentStatus !== "all" ? paymentStatus : undefined,
        sort: dateSort === "desc" ? "-createdAt" : "createdAt",
      });
      setOrders(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, orderStatus, paymentStatus, dateSort, startDate, endDate, minPrice, maxPrice]);

  const fetchGlobalStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const response = await orderService.getOrderStats();
      setGlobalStats(response.data);
    } catch {
      // Silent fail for stats
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchGlobalStats();
  }, [fetchGlobalStats]);

  // Re-fetch stats after any mutation (delete, update)
  const refetchAll = useCallback(() => {
    fetchOrders();
    fetchGlobalStats();
  }, [fetchOrders, fetchGlobalStats]);

  const resetFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setMinPrice("");
    setMaxPrice("");
    setOrderStatus("all");
    setPaymentStatus("all");
    setDateSort("desc");
    setPage(1);
    setSelectedOrders([]);
  };

  const handleSelectAll = () => {
    if (orders.length > 0 && selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o._id));
    }
  };

  const handleSelectOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((s) => s !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handleBatchUpdate = async () => {
    if (!batchStatus || selectedOrders.length === 0) return;
    setIsBatchProcessing(true);
    try {
      await orderService.batchUpdateOrderStatus(selectedOrders, { orderStatus: batchStatus });
      toast.success("Cập nhật trạng thái thành công!");
      refetchAll(); // Sửa ở đây
      setSelectedOrders([]);
      setBatchStatus("");
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const handleSingleUpdate = async (id: string, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(id, { orderStatus: newStatus });
      toast.success("Cập nhật trạng thái thành công!");
      refetchAll(); // Sửa ở đây
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Cập nhật thất bại. Vui lòng thử lại!");
    }
  };

  const openDeleteModal = (order: IOrderAdmin) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSingle = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    try {
      await orderService.deleteOrder(orderToDelete._id);
      toast.success(`Đã xóa đơn hàng #${orderToDelete.orderCode} thành công!`);
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
      refetchAll();
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Xóa đơn hàng thất bại. Vui lòng thử lại!");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedOrders.length === 0) return;
    setIsBatchDeleting(true);
    try {
      await orderService.batchDeleteOrders(selectedOrders);
      toast.success(`Đã xóa ${selectedOrders.length} đơn hàng thành công!`);
      setIsBatchDeleteModalOpen(false);
      setSelectedOrders([]);
      refetchAll();
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Xóa hàng loạt thất bại. Vui lòng thử lại!");
    } finally {
      setIsBatchDeleting(false);
    }
  };

  const statusOptions = [
    { label: "Tất cả trạng thái", value: "all", icon: <Activity className="w-3.5 h-3.5" /> },
    { label: "Chờ xử lý", value: "pending", icon: <Calendar className="w-3.5 h-3.5 text-amber-500" /> },
    { label: "Đang xử lý", value: "processing", icon: <Activity className="w-3.5 h-3.5 text-blue-500" /> },
    { label: "Đang giao", value: "shipped", icon: <Truck className="w-3.5 h-3.5 text-indigo-500" /> },
    { label: "Đã giao hàng", value: "delivered", icon: <Check className="w-3.5 h-3.5 text-emerald-500" /> },
    { label: "Đã hủy", value: "cancelled", icon: <X className="w-3.5 h-3.5 text-red-500" /> },
  ];

  const paymentOptions = [
    { label: "Tất cả thanh toán", value: "all", icon: <CreditCard className="w-3.5 h-3.5" /> },
    { label: "Chưa thanh toán", value: "unpaid", icon: <CreditCard className="w-3.5 h-3.5 text-amber-500" /> },
    { label: "Đã thanh toán", value: "paid", icon: <Check className="w-3.5 h-3.5 text-emerald-500" /> },
    { label: "Đã hoàn tiền", value: "refunded", icon: <X className="w-3.5 h-3.5 text-neutral-400" /> },
  ];

  const sortOptions = [
    { label: "Mới nhất trước", value: "desc", icon: <Calendar className="w-3.5 h-3.5" /> },
    { label: "Cũ nhất trước", value: "asc", icon: <Calendar className="w-3.5 h-3.5 opacity-50" /> },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-50 text-amber-600 border-amber-200";
      case "processing": return "bg-blue-50 text-blue-600 border-blue-200";
      case "shipped": return "bg-indigo-50 text-indigo-600 border-indigo-200";
      case "delivered": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "cancelled": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-neutral-50 text-neutral-600 border-neutral-200";
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch(method) {
      case "cod": return "Thanh toán khi nhận hàng";
      case "banking": return "Chuyển khoản";
      case "momo": return "Ví MoMo";
      default: return method;
    }
  };



  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full pb-10 mx-auto">
      {/* Header */}
      <div className="flex flex-col space-y-1.5 px-2 sm:px-0">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
          QUẢN LÝ KINH DOANH
        </span>
        <h2 className="text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight">
          Đơn hàng
        </h2>
        <p className="text-neutral-500 font-medium text-sm hidden md:block">
          Theo dõi, xử lý và quản lý toàn bộ giao dịch mua hàng của khách.
        </p>
      </div>

      {/* Stats Grid — Row 1: Global (from API) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-0">
        {/* Card: Tổng doanh thu */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between min-h-[140px]">
          <div className="flex items-start justify-between">
            <div className="p-2.5 bg-neutral-900 rounded-lg text-white">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold text-neutral-400 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-100">TOÀN HỆ THỐNG</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Tổng Doanh Thu</p>
            {isStatsLoading ? (
              <div className="h-7 w-32 bg-neutral-100 rounded-md animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-neutral-900 tracking-tight">
                {(globalStats?.totalRevenue ?? 0).toLocaleString()} đ
              </p>
            )}
          </div>
        </div>

        {/* Card: Tổng đơn hàng */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between min-h-[140px]">
          <div className="flex items-start justify-between">
            <div className="p-2.5 bg-neutral-100 rounded-lg text-neutral-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            {!isStatsLoading && globalStats && (
              <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                {globalStats.processingOrders} đang xử lý
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Tổng Đơn Hàng</p>
            {isStatsLoading ? (
              <div className="h-7 w-16 bg-neutral-100 rounded-md animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-neutral-900 tracking-tight">
                {globalStats?.totalOrders ?? 0}
              </p>
            )}
          </div>
        </div>

        {/* Card: Tỷ lệ hoàn thành */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between min-h-[140px]">
          <div className="flex items-start justify-between">
            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            {!isStatsLoading && globalStats && (
              <span className={cn(
                "text-[9px] font-bold px-2 py-1 rounded-md",
                globalStats.completionRate >= 70 ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"
              )}>
                {globalStats.deliveredOrders} đơn
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Tỷ Lệ Hoàn Thành</p>
            {isStatsLoading ? (
              <div className="h-7 w-16 bg-neutral-100 rounded-md animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-emerald-600 tracking-tight">
                {globalStats?.completionRate ?? 0}%
              </p>
            )}
          </div>
        </div>

        {/* Card: Tỷ lệ hủy */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between min-h-[140px]">
          <div className="flex items-start justify-between">
            <div className="p-2.5 bg-red-50 rounded-lg text-red-500">
              <PackageX className="w-5 h-5" />
            </div>
            {!isStatsLoading && globalStats && (
              <span className={cn(
                "text-[9px] font-bold px-2 py-1 rounded-md",
                globalStats.cancellationRate > 15 ? "text-red-600 bg-red-50" : "text-neutral-500 bg-neutral-50"
              )}>
                {globalStats.cancellationRate > 15 ? "⚠️ Cao" : "✓ Bình thường"}
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Tỷ Lệ Hủy Đơn</p>
            {isStatsLoading ? (
              <div className="h-7 w-16 bg-neutral-100 rounded-md animate-pulse" />
            ) : (
              <p className={cn(
                "text-2xl font-bold tracking-tight",
                globalStats && globalStats.cancellationRate > 15 ? "text-red-500" : "text-neutral-900"
              )}>
                {globalStats?.cancellationRate ?? 0}%
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid — Row 2: Mixed */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-0">
        {/* Card: Doanh thu đã thu */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between min-h-[130px]">
          <div className="flex items-start justify-between">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Banknote className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              ĐÃ THU
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Doanh Thu Đã Thu</p>
            {isStatsLoading ? (
              <div className="h-6 w-28 bg-neutral-100 rounded-md animate-pulse" />
            ) : (
              <p className="text-lg font-bold text-emerald-600 tracking-tight tabular-nums">
                {(globalStats?.paidRevenue ?? 0).toLocaleString()} đ
              </p>
            )}
          </div>
        </div>

        {/* Card: Doanh thu chờ thu */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between min-h-[130px]">
          <div className="flex items-start justify-between">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
              CHỜ THU
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Doanh Thu Chờ Thu</p>
            {isStatsLoading ? (
              <div className="h-6 w-28 bg-neutral-100 rounded-md animate-pulse" />
            ) : (
              <p className="text-lg font-bold text-amber-600 tracking-tight tabular-nums">
                {(globalStats?.unpaidRevenue ?? 0).toLocaleString()} đ
              </p>
            )}
          </div>
        </div>

        {/* Card: Đơn hàng hôm nay */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between min-h-[130px]">
          <div className="flex items-start justify-between">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              HÔM NAY
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Đơn Mới Hôm Nay</p>
            {isStatsLoading ? (
              <div className="h-6 w-12 bg-neutral-100 rounded-md animate-pulse" />
            ) : (
              <div className="flex items-end gap-2">
                <p className="text-lg font-bold text-neutral-900 tracking-tight">
                  {globalStats?.todayOrders ?? 0}
                </p>
                <p className="text-[10px] text-neutral-400 font-medium mb-0.5 tabular-nums">
                  {(globalStats?.todayRevenue ?? 0).toLocaleString()} đ
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Card: Giá trị trung bình */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between min-h-[130px]">
          <div className="flex items-start justify-between">
            <div className="p-2 bg-neutral-100 rounded-lg text-neutral-700">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-neutral-500 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-100">
              TRUNG BÌNH
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Giá Trị Đơn (TB)</p>
            {isStatsLoading ? (
              <div className="h-6 w-24 bg-neutral-100 rounded-md animate-pulse" />
            ) : (
              <p className="text-lg font-bold text-neutral-900 tracking-tight tabular-nums">
                {(globalStats?.averageOrderValue ?? 0).toLocaleString()} đ
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4 space-y-4">
        {/* Top Row: Search */}
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md pl-10 pr-4 py-2.5 text-[12px] font-medium outline-none focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900/5 transition-all placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Bottom Row: Filters */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50/50 border border-neutral-200 rounded-md hover:border-neutral-400 hover:bg-white transition-colors flex-1 min-w-[240px] xl:flex-none">
            <Calendar className="w-4 h-4 text-neutral-400 flex-shrink-0" />
            <div className="flex items-center w-full group">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-[11px] font-medium outline-none w-full text-neutral-600 focus:text-neutral-900 cursor-pointer"
                title="Từ ngày"
              />
              <span className="text-neutral-300 text-xs px-2">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-[11px] font-medium outline-none w-full text-neutral-600 focus:text-neutral-900 cursor-pointer"
                title="Đến ngày"
              />
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50/50 border border-neutral-200 rounded-md hover:border-neutral-400 hover:bg-white transition-colors flex-1 min-w-[240px] xl:flex-none">
            <span className="text-neutral-400 font-bold text-[11px] flex-shrink-0">đ</span>
            <div className="flex items-center w-full group">
              <input
                type="number"
                min="0"
                placeholder="Giá từ"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-transparent text-[11px] font-medium outline-none w-full text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400"
                title="Giá từ"
              />
              <span className="text-neutral-300 text-xs px-2">-</span>
              <input
                type="number"
                min="0"
                placeholder="Đến giá"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-transparent text-[11px] font-medium outline-none w-full text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400"
                title="Đến giá"
              />
            </div>
          </div>

          <CustomDropdown
            placeholder="Sắp xếp ngày"
            options={sortOptions}
            value={dateSort}
            onChange={(val) => setDateSort(val as string)}
            icon={<Calendar className="w-4 h-4" />}
          />
          <CustomDropdown
            placeholder="Trạng thái đơn"
            options={statusOptions}
            value={orderStatus}
            onChange={(val) => setOrderStatus(val as string)}
            icon={<Activity className="w-4 h-4" />}
          />
          <CustomDropdown
            placeholder="Thanh toán"
            options={paymentOptions}
            value={paymentStatus}
            onChange={(val) => setPaymentStatus(val as string)}
            icon={<CreditCard className="w-4 h-4" />}
          />
          
          {/* Reset Filters Icon Button */}
          {(searchTerm || dateSort !== "desc" || orderStatus !== "all" || paymentStatus !== "all" || startDate || endDate || minPrice || maxPrice) && (
            <button
              onClick={resetFilters}
              title="Xóa tất cả lọc"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 hover:border-red-200 rounded-md transition-colors text-[11px] font-bold uppercase tracking-wider flex-shrink-0 w-full lg:w-auto mt-2 lg:mt-0"
            >
              <X className="w-3.5 h-3.5" />
              <span className="lg:hidden">Xóa Bộ Lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Batch Actions Toolbar */}
      <AnimatePresence>
        {selectedOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-neutral-900 rounded-xl shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 relative z-20"
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px]">
                {selectedOrders.length}
              </div>
              <span className="text-white text-[13px] font-medium whitespace-nowrap">
                đơn hàng đang chọn
              </span>
              <button
                onClick={() => setSelectedOrders([])}
                className="ml-2 text-neutral-400 hover:text-white transition-colors text-[11px] underline underline-offset-2"
              >
                Bỏ chọn
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <div className="w-[180px]">
                <CustomDropdown
                  placeholder="Chọn trạng thái"
                  options={statusOptions.filter(opt => opt.value !== "all")}
                  value={batchStatus}
                  onChange={(val) => setBatchStatus(val as string)}
                  icon={<Activity className="w-4 h-4" />}
                />
              </div>
              <button
                onClick={handleBatchUpdate}
                disabled={isBatchProcessing || !batchStatus}
                className="px-3 py-2 h-10 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-500/30 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Check className="w-3.5 h-3.5" /> Cập nhật
              </button>
              <button
                onClick={() => setIsBatchDeleteModalOpen(true)}
                disabled={isBatchDeleting}
                className="px-3 py-2 h-10 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xóa đã chọn
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adaptive Orders Display */}
      <div className="w-full min-h-[400px]">
        {/* Mobile: Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {isLoading && orders.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`mob-skel-${i}`} className="bg-white p-4 border border-neutral-200 rounded-xl shadow-sm animate-pulse flex flex-col relative min-h-[190px]">
                <div className="flex justify-between items-start border-b border-neutral-100 pb-3 mb-3">
                  <div className="flex gap-3">
                    <div className="w-4 h-4 rounded bg-neutral-200 mt-0.5" />
                    <div className="space-y-2 mt-1">
                      <div className="h-3 w-20 bg-neutral-200 rounded-md" />
                      <div className="h-2 w-16 bg-neutral-100 rounded-md" />
                    </div>
                  </div>
                  <div className="w-28 h-8 bg-neutral-200 rounded-lg" />
                </div>

                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1 mt-1">
                    <div className="h-3 w-32 bg-neutral-200 rounded-md" />
                    <div className="h-2 w-40 bg-neutral-100 rounded-md" />
                    <div className="h-2 w-28 bg-neutral-100 rounded-md" />
                  </div>
                </div>

                <div className="flex justify-between items-end pt-3 border-t border-neutral-100 mt-auto">
                  <div className="space-y-2">
                    <div className="h-2 w-12 bg-neutral-200 rounded-md" />
                    <div className="h-4 w-24 bg-neutral-200 rounded-md" />
                  </div>
                  <div className="w-9 h-9 bg-neutral-200 rounded-md" />
                </div>
              </div>
            ))
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: isLoading ? 0.6 : 1, y: 0 }}
                key={order._id}
                className={cn(
                  "bg-white p-4 border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col relative",
                  selectedOrders.includes(order._id) && "border-neutral-400 ring-1 ring-neutral-400/20 bg-neutral-50/30"
                )}
              >
                <div className="flex justify-between items-start border-b border-neutral-100 pb-3 mb-3">
                  <div className="flex gap-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => handleSelectOrder(order._id)}
                      className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 mt-0.5 cursor-pointer"
                    />
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest">#{order.orderCode}</p>
                      <p className="text-[9px] text-neutral-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <OrderStatusDropdown
                    currentStatus={order.orderStatus}
                    onStatusChange={(status) => handleSingleUpdate(order._id, status)}
                  />
                </div>

                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 bg-neutral-50 flex items-center justify-center border border-neutral-200 rounded-full shrink-0 text-neutral-500 font-serif italic text-xs">
                    {order.customer.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-neutral-900 truncate uppercase">{order.customer.fullName}</p>
                    <p className="text-[9px] text-neutral-500 truncate mt-0.5">{order.customer.phone} • {order.customer.email}</p>
                    <p className="text-[9px] text-neutral-400 truncate mt-1">
                      <AddressName districtCode={order.customer.district} provinceCode={order.customer.province} />
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-3 border-t border-neutral-100 mt-auto">
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Giá trị</p>
                    <p className="text-sm font-bold text-neutral-900 tabular-nums">{order.finalAmount?.toLocaleString()} đ</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedOrder(order); setIsDrawerOpen(true); }}
                      className="flex-1 flex items-center justify-center p-2 border border-neutral-200 rounded-md hover:bg-neutral-900 hover:border-neutral-900 hover:text-white transition-all text-neutral-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(order)}
                      title="Xóa đơn hàng"
                      className="flex items-center justify-center p-2 border border-red-100 rounded-md hover:bg-red-500 hover:border-red-500 hover:text-white transition-all text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl p-16 text-center col-span-full flex flex-col items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-neutral-200 mb-3" />
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Không tìm thấy đơn hàng</p>
            </div>
          )}
        </div>

        {/* Desktop: Table */}
        <div className="hidden lg:block bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-6 py-4 w-[50px]">
                  <input
                    type="checkbox"
                    checked={orders.length > 0 && selectedOrders.length === orders.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-neutral-300 text-neutral-900 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Mã Đơn</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Khách hàng</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Số điện thoại</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Giá trị</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">T.Thái Đơn</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">Thanh toán</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <AnimatePresence>
                {isLoading && orders.length === 0 ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse border-b border-neutral-100 last:border-0">
                      <td className="px-6 py-4">
                        <div className="w-4 h-4 rounded bg-neutral-200" />
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="space-y-2 mt-1">
                          <div className="h-3 w-16 bg-neutral-200 rounded-md" />
                          <div className="h-2 w-20 bg-neutral-100 rounded-md" />
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-neutral-200 rounded-full shrink-0 mt-0.5" />
                          <div className="space-y-2 mt-1">
                            <div className="h-3 w-28 bg-neutral-200 rounded-md" />
                            <div className="h-2 w-24 bg-neutral-100 rounded-md" />
                            <div className="h-2 w-32 bg-neutral-100 rounded-md" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="h-3 w-24 bg-neutral-200 rounded-md mt-1" />
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="space-y-2 mt-1">
                          <div className="h-3 w-20 bg-neutral-200 rounded-md" />
                          <div className="h-2 w-16 bg-neutral-100 rounded-md" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center align-top">
                        <div className="h-8 w-28 bg-neutral-200 rounded-lg mx-auto" />
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col items-center gap-2 mt-1">
                          <div className="h-3 w-16 bg-neutral-200 rounded-md" />
                          <div className="h-2 w-24 bg-neutral-100 rounded-md" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right align-top">
                        <div className="flex justify-end gap-2">
                          <div className="w-8 h-8 bg-neutral-200 rounded-md" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isLoading ? 0.6 : 1 }}
                      exit={{ opacity: 0 }}
                      key={order._id}
                      className={cn("group hover:bg-neutral-50/50 transition-colors duration-200", selectedOrders.includes(order._id) && "bg-neutral-50/80")}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleSelectOrder(order._id)}
                          className="w-4 h-4 rounded border-neutral-300 text-neutral-900 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest">#{order.orderCode}</p>
                          <p className="text-[10px] text-neutral-400 font-medium tabular-nums flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center text-[10px] font-serif italic text-neutral-600 shrink-0 mt-0.5">
                            {order.customer.fullName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-tight truncate max-w-[180px]">
                              {order.customer.fullName}
                            </p>
                            <p className="text-[10px] text-neutral-500 truncate mt-0.5">{order.customer.email}</p>
                            <p className="text-[9px] text-neutral-400 truncate mt-1 italic max-w-[200px]">
                              <AddressName districtCode={order.customer.district} provinceCode={order.customer.province} />
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <p className="text-[11px] font-medium text-neutral-900 tabular-nums">{order.customer.phone}</p>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="space-y-1">
                          <p className="text-[13px] font-bold text-neutral-900 tabular-nums">{order.finalAmount?.toLocaleString()} đ</p>
                          <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-tight">
                            {order.items.length} SẢN PHẨM
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center align-top">
                        <OrderStatusDropdown
                          currentStatus={order.orderStatus}
                          onStatusChange={(status) => handleSingleUpdate(order._id, status)}
                        />
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col items-center gap-1.5 text-center">
                          <span className={cn(
                            "text-[9px] font-bold uppercase tracking-widest",
                            order.paymentStatus === "paid" ? "text-emerald-500" :
                            order.paymentStatus === "refunded" ? "text-neutral-400" : "text-amber-500"
                          )}>
                            {order.paymentStatus}
                          </span>
                          <span className="text-[9px] text-neutral-400 mt-1">
                            {getPaymentMethodLabel(order.customer.paymentMethod)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setSelectedOrder(order); setIsDrawerOpen(true); }}
                            title="Xem chi tiết"
                            className="p-2 flex items-center justify-center border border-neutral-200 rounded-md hover:bg-neutral-900 hover:border-neutral-900 hover:text-white transition-all text-neutral-600 shadow-sm"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(order)}
                            title="Xóa đơn hàng"
                            className="p-2 flex items-center justify-center border border-red-100 rounded-md hover:bg-red-500 hover:border-red-500 hover:text-white transition-all text-red-400 shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <ShoppingBag className="w-10 h-10 text-neutral-200" />
                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Danh sách trống</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm mt-4">
          <p className="text-[11px] text-neutral-500 font-medium">
            Hiển thị <span className="font-bold text-neutral-900">{orders.length}</span> trên tổng số <span className="font-bold text-neutral-900">{totalElements}</span> đơn hàng
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <OrderDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        order={selectedOrder}
        onUpdateSuccess={refetchAll} // Sửa ở đây
      />

      {/* Single Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && orderToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900"
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-neutral-900 tracking-tight">Xác nhận xóa đơn hàng</h3>
                    <p className="text-[12px] text-neutral-500 mt-0.5">Hành động này không thể hoàn tác</p>
                  </div>
                </div>

                <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 mb-5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Mã đơn hàng</span>
                    <span className="text-[11px] font-bold text-neutral-900">#{orderToDelete.orderCode}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Khách hàng</span>
                    <span className="text-[11px] font-medium text-neutral-700">{orderToDelete.customer.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Giá trị</span>
                    <span className="text-[11px] font-bold text-neutral-900">{orderToDelete.finalAmount?.toLocaleString()} đ</span>
                  </div>
                </div>

                <p className="text-[12px] text-neutral-500 mb-6">
                  Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này? Dữ liệu sẽ không thể khôi phục sau khi xóa.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 text-[12px] font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleDeleteSingle}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 text-[12px] font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Đang xóa...
                      </>
                    ) : (
                      <><Trash2 className="w-3.5 h-3.5" /> Xóa đơn hàng</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Batch Delete Confirmation Modal */}
      <AnimatePresence>
        {isBatchDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900"
              onClick={() => !isBatchDeleting && setIsBatchDeleteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-neutral-900 tracking-tight">Xác nhận xóa hàng loạt</h3>
                    <p className="text-[12px] text-neutral-500 mt-0.5">Hành động này không thể hoàn tác</p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
                  <p className="text-[12px] font-semibold text-red-700 text-center">
                    Bạn đang xóa <span className="text-[14px] font-bold">{selectedOrders.length}</span> đơn hàng
                  </p>
                </div>

                <p className="text-[12px] text-neutral-500 mb-6">
                  Tất cả các đơn hàng đã chọn sẽ bị xóa vĩnh viễn và không thể khôi phục. Hãy chắc chắn trước khi tiếp tục.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsBatchDeleteModalOpen(false)}
                    disabled={isBatchDeleting}
                    className="flex-1 px-4 py-2.5 text-[12px] font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleBatchDelete}
                    disabled={isBatchDeleting}
                    className="flex-1 px-4 py-2.5 text-[12px] font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isBatchDeleting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Đang xóa...
                      </>
                    ) : (
                      <><Trash2 className="w-3.5 h-3.5" /> Xóa {selectedOrders.length} đơn hàng</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
