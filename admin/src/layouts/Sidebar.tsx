import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Tag, 
  Image as ImageIcon,
  Menu,
  X,
  Shield,
  User,
  Trash2
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../utils/cn";
import { useAuthStore } from "../stores/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { orderService } from "../services/order.service";

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  to, 
  active,
  onClick,
  badgeCount
}: { 
  icon: React.ElementType; 
  label: string; 
  to: string; 
  active: boolean;
  onClick?: () => void;
  badgeCount?: number;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "group flex items-center justify-between px-8 py-4.5 text-sm transition-all duration-500",
      active 
        ? "bg-neutral-900 text-white shadow-lg shadow-neutral-200 z-10" 
        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
    )}
  >
    <div className="flex items-center gap-4">
      <div className="relative">
        <Icon className={cn("w-4 h-4 transition-colors duration-500", active ? "text-white" : "group-hover:text-neutral-900")} />
        {!!badgeCount && badgeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {badgeCount > 99 ? '99+' : badgeCount}
          </span>
        )}
      </div>
      <span className="font-bold tracking-[0.15em] uppercase text-[10px]">{label}</span>
    </div>
    {active && (
      <motion.div layoutId="active-indicator">
        <ChevronRight className="w-3.5 h-3.5" />
      </motion.div>
    )}
  </Link>
);

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const admin = useAuthStore((state) => state.admin);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await orderService.getOrderStats();
        if (response.data && response.data.pendingOrders !== undefined) {
          setPendingOrdersCount(response.data.pendingOrders);
        }
      } catch (error) {
        console.error("Failed to fetch order stats for sidebar", error);
      }
    };
    
    fetchPendingOrders();
    const intervalId = setInterval(fetchPendingOrders, 60000); // refresh every minute
    return () => clearInterval(intervalId);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: "Tổng quan", to: "/" },
    { icon: ShoppingBag, label: "Sản phẩm", to: "/products" },
    { icon: Tag, label: "Đơn hàng", to: "/orders", badgeCount: pendingOrdersCount },
    { icon: Users, label: "Khách hàng", to: "/customers" },
    { icon: User, label: "Nhân viên", to: "/staff" },
    { icon: Shield, label: "Phân quyền", to: "/permissions" },
    { icon: ImageIcon, label: "Nội dung", to: "/cms" },
    // { icon: Trash2, label: "Thùng rác", to: "/trash" },
    { icon: Settings, label: "Cài đặt", to: "/settings" },
  ];

  return (
    <>
      {/* Mobile Backdrop - High Blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/10 backdrop-blur-md z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Fluid Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-72 bg-white border-r border-neutral-100 flex flex-col z-[60] transition-all duration-700 ease-in-out lg:translate-x-0 shadow-sm",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-10 flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-serif tracking-tighter text-neutral-900">TENCLOTHES</h1>
            <p className="text-[8px] font-black text-neutral-400 uppercase tracking-[0.4em]">Control Panel</p>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-neutral-400 hover:text-neutral-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 mt-8 space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={location.pathname === item.to}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              badgeCount={item.badgeCount}
            />
          ))}
        </nav>

        {/* Admin Profile Section */}
        <div className="p-8 border-t border-neutral-50 bg-neutral-50/30">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-11 h-11 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-sm font-serif italic text-neutral-700 shadow-sm">
              {admin?.fullName?.charAt(0) || "A"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[12px] font-bold text-neutral-900 truncate leading-none mb-1">{admin?.fullName || "Administrator"}</span>
              <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest leading-none">{admin?.role || "System Owner"}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 text-[9px] font-black uppercase tracking-[0.25em] border border-neutral-100 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
