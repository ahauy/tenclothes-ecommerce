import React, { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Activity,
  Check,
  X,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { customerService } from "../services/customer.service";
import type { ICustomerAdmin } from "../interfaces/customer.interface";
import { cn } from "../utils/cn";
import { toast } from "sonner";
import type { IJsonFail } from "../interfaces/api.interface";

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<ICustomerAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await customerService.getCustomers({
        page,
        limit: 10,
        keyword: searchTerm,
      });
      setCustomers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Không thể tải danh sách khách hàng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, searchTerm]);

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-1000 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 w-full">
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-1 block">
            Customer Relations
          </span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight">
            Khách hàng
          </h2>
          <p className="text-neutral-500 font-light text-xs mt-1 hidden md:block">
            Quản lý thông tin tài khoản và lịch sử hoạt động của khách hàng.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="w-full relative group max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
        <input
          type="text"
          placeholder="TÌM THEO TÊN, EMAIL, SỐ ĐIỆN THOẠI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-neutral-100 pl-12 pr-4 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-300 shadow-sm"
        />
      </div>

      {/* Presentation Layer */}
      <div className="w-full">
        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-6 border border-neutral-100 animate-pulse h-48 shadow-sm" />
            ))
          ) : customers.length > 0 ? (
            customers.map((customer) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={customer._id}
                className="bg-white p-6 border border-neutral-100 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-serif italic text-neutral-600 border border-neutral-200">
                    {customer.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest truncate">{customer.fullName}</h4>
                    <div className="flex items-center gap-1 text-[8px] font-bold text-neutral-400 uppercase tracking-tighter">
                       <Activity className="w-2.5 h-2.5" />
                       <span className={customer.isActive ? "text-green-500" : "text-neutral-300"}>{customer.isActive ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2 border-t border-neutral-50">
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                    <Mail className="w-3 h-3" /> {customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                    <Phone className="w-3 h-3" /> {customer.phone || "N/A"}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                   <button className="p-2 border border-neutral-100 hover:bg-neutral-900 hover:text-white transition-all"><Eye className="w-4 h-4" /></button>
                   <button className="p-2 border border-neutral-100 hover:bg-red-500 hover:text-white transition-all text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))
          ) : null}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden lg:block bg-white border border-neutral-100 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100">
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Khách hàng</th>
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Liên hệ</th>
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Ngày đăng ký</th>
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-8 h-20 bg-neutral-50/10" />
                    </tr>
                  ))
                ) : customers.length > 0 ? (
                  customers.map((customer) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={customer._id}
                      className="group hover:bg-neutral-50/30 transition-all duration-300"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-[10px] font-serif italic text-neutral-600">
                            {customer.fullName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest group-hover:text-black transition-colors">{customer.fullName}</h4>
                            <p className="text-[9px] text-neutral-400 mt-0.5 font-medium uppercase tracking-tighter">ID: {customer._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px] text-neutral-600 font-medium">
                            <Mail className="w-3 h-3 text-neutral-300" /> {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-[9px] text-neutral-400 font-bold tracking-widest uppercase">
                            <Phone className="w-2.5 h-2.5 text-neutral-200" /> {customer.phone || "No Phone"}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <div className="flex justify-center">
                            <div className={cn(
                              "px-3 py-1 text-[8px] font-black uppercase tracking-widest border rounded-[1px]",
                              customer.isActive ? "bg-green-50 text-green-600 border-green-100" : "bg-neutral-50 text-neutral-400 border-neutral-100"
                            )}>
                               {customer.isActive ? "Active" : "Inactive"}
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                           {new Date(customer.createdAt).toLocaleDateString("vi-VN")}
                         </p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button title="Hồ sơ" className="p-2.5 hover:bg-neutral-900 hover:text-white transition-all border border-neutral-50 rounded-[2px] shadow-sm"><User className="w-4 h-4 stroke-[1.25]" /></button>
                          <button title="Xóa" className="p-2.5 hover:bg-red-600 hover:text-white transition-all border border-neutral-50 rounded-[2px] shadow-sm"><Trash2 className="w-4 h-4 stroke-[1.25]" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                   <tr><td colSpan={5} className="px-8 py-32 text-center text-[10px] font-bold text-neutral-300 uppercase tracking-[0.4em]">Danh sách khách hàng trống</td></tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-8 py-8 bg-white border border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-6 w-full shadow-sm">
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Trang {page} / {totalPages}</p>
        <div className="flex gap-4">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-6 py-2.5 bg-white border border-neutral-100 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-neutral-900 hover:text-white transition-all flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Trước</button>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-6 py-2.5 bg-white border border-neutral-100 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-neutral-900 hover:text-white transition-all flex items-center gap-2">Sau <ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};

export default Customers;
