import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  Check,
  X,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { staffService } from "../services/staff.service";
import type { IStaffAdmin } from "../interfaces/staff.interface";
import { cn } from "../utils/cn";
import { toast } from "sonner";
import type { IJsonFail } from "../interfaces/api.interface";

const Staff: React.FC = () => {
  const [staffList, setStaffList] = useState<IStaffAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const response = await staffService.getStaffs({
        page,
        limit: 10,
        keyword: searchTerm,
      });
      setStaffList(response.data.staffs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Không thể tải danh sách nhân viên");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [page, searchTerm]);

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-1000 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 w-full">
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-1 block">
            Internal Operations
          </span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight">
            Quản lý nhân viên
          </h2>
          <p className="text-neutral-500 font-light text-xs mt-1 hidden md:block">
            Cấp quyền và quản lý tài khoản đội ngũ vận hành hệ thống.
          </p>
        </div>
        <button
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm nhân viên</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="w-full relative group max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
        <input
          type="text"
          placeholder="TÌM THEO TÊN, EMAIL, CHỨC VỤ..."
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
              <div key={i} className="bg-white p-6 border border-neutral-100 animate-pulse h-56 shadow-sm" />
            ))
          ) : staffList.length > 0 ? (
            staffList.map((staff) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={staff._id}
                className="bg-white p-6 border border-neutral-100 shadow-sm space-y-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-serif italic text-neutral-600 border border-neutral-200 overflow-hidden shadow-inner">
                    {staff.avatar ? <img src={staff.avatar} alt={staff.fullName} className="w-full h-full object-cover" /> : staff.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[12px] font-bold text-neutral-900 uppercase tracking-widest truncate">{staff.fullName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={cn(
                         "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border",
                         staff.role === "admin" ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                       )}>
                         {staff.role}
                       </span>
                       <div className={cn("w-2 h-2 rounded-full", staff.isActive ? "bg-green-400" : "bg-neutral-300")} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2 border-t border-neutral-50">
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                    <Mail className="w-3 h-3 text-neutral-300" /> {staff.email}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                    <Phone className="w-3 h-3 text-neutral-300" /> {staff.phone}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                   <button className="p-2.5 border border-neutral-100 hover:bg-neutral-900 hover:text-white transition-all shadow-sm"><Edit2 className="w-4 h-4" /></button>
                   <button className="p-2.5 border border-neutral-100 hover:bg-red-500 hover:text-white transition-all text-red-400 shadow-sm"><Trash2 className="w-4 h-4" /></button>
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
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Thành viên</th>
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Liên hệ</th>
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-center">Vai trò</th>
                <th className="px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-center">Trạng thái</th>
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
                ) : staffList.length > 0 ? (
                  staffList.map((staff) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={staff._id}
                      className="group hover:bg-neutral-50/30 transition-all duration-300"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-[10px] font-serif italic text-neutral-600 overflow-hidden shadow-sm">
                             {staff.avatar ? <img src={staff.avatar} alt={staff.fullName} className="w-full h-full object-cover" /> : staff.fullName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest group-hover:text-black transition-colors">{staff.fullName}</h4>
                            <p className="text-[8px] text-neutral-400 mt-0.5 font-black uppercase tracking-[0.2em]">{staff.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px] text-neutral-600 font-medium">
                            <Mail className="w-3 h-3 text-neutral-300" /> {staff.email}
                          </div>
                          <div className="flex items-center gap-2 text-[9px] text-neutral-400 font-bold tracking-widest uppercase">
                            <Phone className="w-2.5 h-2.5 text-neutral-200" /> {staff.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <div className="flex justify-center">
                            <span className={cn(
                              "px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] border rounded-[1px] shadow-sm",
                              staff.role === "admin" ? "bg-red-900 text-white border-red-900" : "bg-neutral-50 text-neutral-900 border-neutral-100"
                            )}>
                               {staff.role}
                            </span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <div className="flex justify-center">
                            <div className={cn(
                              "w-10 h-5 p-0.5 rounded-full transition-all duration-500 border",
                              staff.isActive ? "bg-neutral-900 border-neutral-900" : "bg-neutral-100 border-neutral-200"
                            )}>
                               <div className={cn("w-3.5 h-3.5 bg-white rounded-full transition-all", staff.isActive ? "translate-x-5" : "translate-x-0")} />
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button title="Chỉnh sửa" className="p-2.5 hover:bg-neutral-900 hover:text-white transition-all border border-neutral-50 rounded-[2px] shadow-sm"><Edit2 className="w-4 h-4 stroke-[1.25]" /></button>
                          <button title="Xóa" className="p-2.5 hover:bg-red-600 hover:text-white transition-all border border-neutral-50 rounded-[2px] shadow-sm"><Trash2 className="w-4 h-4 stroke-[1.25]" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                   <tr><td colSpan={5} className="px-8 py-40 text-center text-[10px] font-bold text-neutral-300 uppercase tracking-[0.4em]">Danh sách nhân sự trống</td></tr>
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
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-6 py-2.5 bg-white border border-neutral-100 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-neutral-900 hover:text-white transition-all flex items-center gap-2 shadow-sm"><ChevronLeft className="w-4 h-4" /> Trước</button>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-6 py-2.5 bg-white border border-neutral-100 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-neutral-900 hover:text-white transition-all flex items-center gap-2 shadow-sm">Sau <ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};

export default Staff;
