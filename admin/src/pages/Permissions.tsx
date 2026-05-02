import React, { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Trash2,
  Check,
  X,
  ChevronRight,
  Save,
  Lock,
  Zap,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { roleService } from "../services/role.service";
import type { IRoleAdmin, IPermissionGroup } from "../interfaces/role.interface";
import { cn } from "../utils/cn";
import { toast } from "sonner";

const Permissions: React.FC = () => {
  const [roles, setRoles] = useState<IRoleAdmin[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<IPermissionGroup[]>([]);
  const [selectedRole, setSelectedRole] = useState<IRoleAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, groupsRes] = await Promise.all([
          roleService.getRoles(),
          roleService.getPermissions(),
        ]);
        setRoles(rolesRes.data);
        setPermissionGroups(groupsRes);
        if (rolesRes.data.length > 0) setSelectedRole(rolesRes.data[0]);
      } catch (error) {
        toast.error("Không thể tải thông tin phân quyền");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTogglePermission = (key: string) => {
    if (!selectedRole) return;
    const currentPermissions = [...selectedRole.permissions];
    const index = currentPermissions.indexOf(key);
    if (index > -1) {
      currentPermissions.splice(index, 1);
    } else {
      currentPermissions.push(key);
    }
    setSelectedRole({ ...selectedRole, permissions: currentPermissions });
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    setIsSubmitting(true);
    try {
      await roleService.updateRole(selectedRole._id, { permissions: selectedRole.permissions });
      toast.success("Cập nhật phân quyền thành công");
      // Update local roles list
      setRoles(roles.map(r => r._id === selectedRole._id ? selectedRole : r));
    } catch (error) {
      toast.error("Lỗi khi lưu phân quyền");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse text-[10px] font-black uppercase tracking-[0.4em]">Initializing Security...</div>;

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-1000 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 w-full">
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-1 block">
            Access Control
          </span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight">
            Phân quyền
          </h2>
          <p className="text-neutral-500 font-light text-xs mt-1 hidden md:block">
            Quản lý vai trò và giới hạn truy cập cho từng bộ phận nhân sự.
          </p>
        </div>
        <button
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo vai trò mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Roles List */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
           <div className="bg-white border border-neutral-100 shadow-sm p-2">
              <p className="px-4 py-3 text-[9px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-50 mb-2">Danh sách vai trò</p>
              <div className="space-y-1">
                {roles.map((role) => (
                  <button
                    key={role._id}
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      "w-full flex items-center justify-between px-5 py-4 transition-all duration-300 group",
                      selectedRole?._id === role._id 
                        ? "bg-neutral-900 text-white shadow-lg" 
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Shield className={cn("w-3.5 h-3.5", selectedRole?._id === role._id ? "text-red-400" : "text-neutral-300 group-hover:text-neutral-900")} />
                      <span className="text-[11px] font-bold uppercase tracking-widest">{role.title}</span>
                    </div>
                    {selectedRole?._id === role._id && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
           </div>

           <div className="bg-amber-50 border border-amber-100 p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-700">
                <Info className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Lưu ý bảo mật</p>
              </div>
              <p className="text-[10px] text-amber-600 font-medium leading-relaxed uppercase tracking-tight">
                Mọi thay đổi về quyền sẽ có hiệu lực ngay lập tức sau khi người dùng tải lại trang. Cần thận trọng khi cấp quyền Xóa dữ liệu.
              </p>
           </div>
        </div>

        {/* Permissions Grid */}
        <div className="lg:col-span-8 xl:col-span-9">
          <AnimatePresence mode="wait">
            {selectedRole ? (
              <motion.div
                key={selectedRole._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-neutral-100 shadow-sm flex flex-col h-full"
              >
                {/* Role Detail Header */}
                <div className="p-8 sm:p-10 border-b border-neutral-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-neutral-50/20">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-neutral-900 tracking-tight uppercase">{selectedRole.title}</h3>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                      Quản lý các đặc quyền truy cập cho nhóm này
                    </p>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Đang lưu..." : "Lưu thay đổi"}</span>
                  </button>
                </div>

                {/* Permissions Groups */}
                <div className="p-8 sm:p-10 space-y-12 overflow-y-auto max-h-[70vh] custom-scrollbar">
                  {permissionGroups.map((group) => (
                    <div key={group.module} className="space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="h-[1px] flex-1 bg-neutral-100" />
                         <span className="text-[10px] font-black text-neutral-900 uppercase tracking-[0.4em] px-4">{group.module}</span>
                         <div className="h-[1px] flex-1 bg-neutral-100" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {group.permissions.map((perm) => (
                          <div 
                            key={perm.key}
                            onClick={() => handleTogglePermission(perm.key)}
                            className={cn(
                              "p-5 border-2 transition-all duration-500 flex justify-between items-center group cursor-pointer relative overflow-hidden",
                              selectedRole.permissions.includes(perm.key)
                                ? "bg-neutral-900 border-neutral-900 text-white shadow-xl"
                                : "bg-white border-neutral-50 text-neutral-500 hover:border-neutral-200"
                            )}
                          >
                            <div className="space-y-1 relative z-10">
                               <p className="text-[9px] font-black uppercase tracking-widest">{perm.label}</p>
                            </div>
                            <div className={cn(
                              "w-10 h-5.5 rounded-full relative transition-all duration-500 border-2 z-10",
                              selectedRole.permissions.includes(perm.key) ? "bg-white/10 border-white/20" : "bg-neutral-100 border-neutral-200"
                            )}>
                               <div className={cn(
                                 "absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all duration-500 shadow-sm",
                                 selectedRole.permissions.includes(perm.key) ? "right-0.5 bg-white" : "left-0.5 bg-neutral-300"
                               )} />
                            </div>
                            {selectedRole.permissions.includes(perm.key) && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-2 -bottom-2 opacity-5">
                                 <Zap className="w-16 h-16 text-white" />
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="h-full bg-white border border-dashed border-neutral-200 flex flex-col items-center justify-center p-20 space-y-4">
                 <Lock className="w-12 h-12 text-neutral-100" />
                 <p className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.4em]">Chọn vai trò để cấu hình</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
