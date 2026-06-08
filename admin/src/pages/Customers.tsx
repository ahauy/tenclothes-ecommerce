import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  Activity,
  Check,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { customerService } from "../services/customer.service";
import type { ICustomerAdmin } from "../interfaces/customer.interface";
import { cn } from "../utils/cn";
import { toast } from "sonner";
import type { IJsonFail } from "../interfaces/api.interface";
import CustomDropdown from "../components/UI/CustomDropdown";
import Pagination from "../components/UI/Pagination";

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<ICustomerAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters State
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateSort, setDateSort] = useState<string>("desc");

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<ICustomerAdmin | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce: update debouncedSearchTerm after 500ms when user stops typing
  useEffect(() => {
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchTerm]);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await customerService.getCustomers({
        page,
        limit: 8,
        keyword: debouncedSearchTerm,
        isActive: statusFilter !== "all" ? (statusFilter === "active" ? true : false) : undefined,
        sort: dateSort === "desc" ? "-createdAt" : "createdAt",
      });
      setCustomers(response.data.users || response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalElements(response.data.totalElements || 0);
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Không thể tải danh sách khách hàng");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearchTerm, statusFilter, dateSort]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateSort("desc");
    setPage(1);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await customerService.updateCustomerStatus(id, !currentStatus);
      toast.success(currentStatus ? "Đã khóa tài khoản khách hàng" : "Đã kích hoạt tài khoản khách hàng");
      fetchCustomers();
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Cập nhật trạng thái thất bại");
    }
  };

  const openDeleteModal = (customer: ICustomerAdmin) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSingle = async () => {
    if (!customerToDelete) return;
    setIsDeleting(true);
    try {
      await customerService.deleteCustomer(customerToDelete._id);
      toast.success(`Đã xóa khách hàng ${customerToDelete.fullName} thành công!`);
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
      
      if (customers.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchCustomers();
      }
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Xóa khách hàng thất bại. Vui lòng thử lại!");
    } finally {
      setIsDeleting(false);
    }
  };

  const statusOptions = [
    { label: "Tất cả trạng thái", value: "all", icon: <Activity className="w-3.5 h-3.5" /> },
    { label: "Đang hoạt động", value: "active", icon: <Check className="w-3.5 h-3.5 text-emerald-500" /> },
    { label: "Đã khóa", value: "inactive", icon: <X className="w-3.5 h-3.5 text-red-500" /> },
  ];

  const sortOptions = [
    { label: "Mới nhất trước", value: "desc", icon: <Calendar className="w-3.5 h-3.5" /> },
    { label: "Cũ nhất trước", value: "asc", icon: <Calendar className="w-3.5 h-3.5 opacity-50" /> },
  ];

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full pb-10 mx-auto">
      {/* Header */}
      <div className="flex flex-col space-y-1.5 px-2 sm:px-0">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
          QUẢN LÝ NGƯỜI DÙNG
        </span>
        <h2 className="text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight">
          Khách hàng
        </h2>
        <p className="text-neutral-500 font-medium text-sm hidden md:block">
          Theo dõi, quản lý thông tin tài khoản và hoạt động của khách hàng.
        </p>
      </div>

      {/* Stats Quick View (Mocking based on current page data as global stats missing) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-0">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
          <div className="flex items-start justify-between">
            <div className="p-2.5 bg-neutral-900 rounded-lg text-white">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold text-neutral-400 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-100">DANH SÁCH</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Hiển thị</p>
            <p className="text-2xl font-bold text-neutral-900 tracking-tight">
              {totalElements || customers.length}
            </p>
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
              placeholder="Tìm kiếm theo tên khách hàng, email hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md pl-10 pr-4 py-2.5 text-[12px] font-medium outline-none focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900/5 transition-all placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Bottom Row: Filters */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full">
          <CustomDropdown
            placeholder="Sắp xếp ngày"
            options={sortOptions}
            value={dateSort}
            onChange={(val) => setDateSort(val as string)}
            icon={<Calendar className="w-4 h-4" />}
          />
          <CustomDropdown
            placeholder="Trạng thái"
            options={statusOptions}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as string)}
            icon={<Activity className="w-4 h-4" />}
          />
          
          {/* Reset Filters */}
          {(searchTerm || dateSort !== "desc" || statusFilter !== "all") && (
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

      {/* Adaptive Display */}
      <div className="w-full min-h-[400px]">
        {/* Mobile: Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {isLoading && customers.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`mob-skel-${i}`} className="bg-white p-4 border border-neutral-200 rounded-xl shadow-sm animate-pulse flex flex-col relative min-h-[190px]">
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1 mt-1">
                    <div className="h-3 w-32 bg-neutral-200 rounded-md" />
                    <div className="h-2 w-40 bg-neutral-100 rounded-md" />
                  </div>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-neutral-100 mt-auto">
                  <div className="h-4 w-20 bg-neutral-200 rounded-md" />
                  <div className="w-9 h-9 bg-neutral-200 rounded-md" />
                </div>
              </div>
            ))
          ) : customers.length > 0 ? (
            customers.map((customer) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: isLoading ? 0.6 : 1, y: 0 }}
                key={customer._id}
                className="bg-white p-4 border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col relative"
              >
                <div className="flex justify-between items-start border-b border-neutral-100 pb-3 mb-3">
                   <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-[10px] font-serif italic text-neutral-600">
                         {customer.fullName.charAt(0)}
                       </div>
                       <div>
                           <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest truncate">{customer.fullName}</p>
                           <p className="text-[9px] text-neutral-400 font-medium">Tham gia: {new Date(customer.createdAt).toLocaleDateString("vi-VN")}</p>
                       </div>
                   </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-600">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" /> <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-600">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" /> <span>{customer.phone || "Chưa cập nhật"}</span>
                  </div>
                  {customer.addresses && customer.addresses.length > 0 && (
                    <div className="flex items-start gap-2 text-[11px] text-neutral-600">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" /> 
                      <span className="line-clamp-2">
                        {`${customer.addresses[0].address}, ${customer.addresses[0].ward}, ${customer.addresses[0].district}, ${customer.addresses[0].province}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end pt-3 border-t border-neutral-100 mt-auto">
                  <button
                    onClick={() => handleToggleStatus(customer._id, customer.isActive)}
                    className={cn(
                      "px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-md border transition-colors",
                      customer.isActive 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" 
                        : "bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100"
                    )}
                  >
                    {customer.isActive ? "Đang hoạt động" : "Đã khóa"}
                  </button>
                  <button 
                    onClick={() => openDeleteModal(customer)}
                    title="Xóa khách hàng"
                    className="flex items-center justify-center p-2 border border-red-100 rounded-md hover:bg-red-500 hover:border-red-500 hover:text-white transition-all text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl p-16 text-center col-span-full flex flex-col items-center justify-center">
              <User className="w-10 h-10 text-neutral-200 mb-3" />
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Không tìm thấy khách hàng</p>
            </div>
          )}
        </div>

        {/* Desktop: Table */}
        <div className="hidden lg:block bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Khách hàng</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Liên hệ</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Địa chỉ</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <AnimatePresence>
                {isLoading && customers.length === 0 ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse border-b border-neutral-100 last:border-0">
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-neutral-200 rounded-full shrink-0 mt-0.5" />
                          <div className="space-y-2 mt-1">
                            <div className="h-3 w-28 bg-neutral-200 rounded-md" />
                            <div className="h-2 w-24 bg-neutral-100 rounded-md" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                         <div className="space-y-2 mt-1">
                           <div className="h-3 w-32 bg-neutral-200 rounded-md" />
                           <div className="h-2 w-24 bg-neutral-100 rounded-md" />
                         </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="h-3 w-40 bg-neutral-200 rounded-md mt-1" />
                      </td>
                      <td className="px-6 py-4 text-center align-top">
                        <div className="h-6 w-20 bg-neutral-200 rounded-lg mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-right align-top">
                        <div className="flex justify-end gap-2">
                          <div className="w-8 h-8 bg-neutral-200 rounded-md" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : customers.length > 0 ? (
                  customers.map((customer) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isLoading ? 0.6 : 1 }}
                      exit={{ opacity: 0 }}
                      key={customer._id}
                      className="group hover:bg-neutral-50/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center text-[10px] font-serif italic text-neutral-600 shrink-0 mt-0.5">
                            {customer.fullName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-tight truncate max-w-[180px]">
                              {customer.fullName}
                            </p>
                            <p className="text-[9px] text-neutral-400 font-medium flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(customer.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="space-y-1">
                           <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-700">
                             <Mail className="w-3.5 h-3.5 text-neutral-400" /> {customer.email}
                           </div>
                           <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-700">
                             <Phone className="w-3.5 h-3.5 text-neutral-400" /> {customer.phone || "—"}
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                         {customer.addresses && customer.addresses.length > 0 ? (
                           <div className="flex items-start gap-1.5 text-[11px] font-medium text-neutral-600 max-w-[250px]">
                              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">
                                {`${customer.addresses[0].address}, ${customer.addresses[0].ward}, ${customer.addresses[0].district}, ${customer.addresses[0].province}`}
                              </span>
                           </div>
                         ) : (
                           <span className="text-[11px] text-neutral-400 italic">Chưa có địa chỉ</span>
                         )}
                      </td>
                      <td className="px-6 py-4 text-center align-top">
                        <button
                          onClick={() => handleToggleStatus(customer._id, customer.isActive)}
                          className={cn(
                            "px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-md border transition-colors inline-flex",
                            customer.isActive 
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" 
                              : "bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100"
                          )}
                        >
                          {customer.isActive ? "Hoạt động" : "Đã khóa"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openDeleteModal(customer)}
                            title="Xóa khách hàng"
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
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <User className="w-10 h-10 text-neutral-200" />
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
            Hiển thị <span className="font-bold text-neutral-900">{customers.length}</span> trên tổng số <span className="font-bold text-neutral-900">{totalElements || '-'}</span> khách hàng
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && customerToDelete && (
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
                    <h3 className="text-[15px] font-bold text-neutral-900 tracking-tight">Xác nhận xóa khách hàng</h3>
                    <p className="text-[12px] text-neutral-500 mt-0.5">Hành động này không thể hoàn tác</p>
                  </div>
                </div>

                <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 mb-5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Tên khách hàng</span>
                    <span className="text-[11px] font-bold text-neutral-900">{customerToDelete.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Email</span>
                    <span className="text-[11px] font-medium text-neutral-700">{customerToDelete.email}</span>
                  </div>
                </div>

                <p className="text-[12px] text-neutral-500 mb-6">
                  Bạn có chắc chắn muốn xóa vĩnh viễn khách hàng này? Tất cả dữ liệu liên quan sẽ bị xóa và không thể khôi phục.
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
                      <><Trash2 className="w-3.5 h-3.5" /> Xóa khách hàng</>
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

export default Customers;
