import React from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Tag, 
  Image as ImageIcon
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../utils/cn";
import { useAuthStore } from "../stores/useAuthStore";

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  to, 
  active 
}: { 
  icon: any; 
  label: string; 
  to: string; 
  active: boolean 
}) => (
  <Link
    to={to}
    className={cn(
      "group flex items-center justify-between px-4 py-3 text-sm transition-all duration-300",
      active 
        ? "bg-neutral-900 text-white" 
        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
    )}
  >
    <div className="flex items-center gap-3">
      <Icon className={cn("w-4 h-4 transition-colors", active ? "text-white" : "group-hover:text-neutral-900")} />
      <span className="font-medium tracking-wide uppercase text-[10px]">{label}</span>
    </div>
    {active && <ChevronRight className="w-3 h-3" />}
  </Link>
);

const Sidebar: React.FC = () => {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const admin = useAuthStore((state) => state.admin);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/" },
    { icon: ShoppingBag, label: "Sản phẩm", to: "/products" },
    { icon: Tag, label: "Đơn hàng", to: "/orders" },
    { icon: Users, label: "Khách hàng", to: "/customers" },
    { icon: ImageIcon, label: "Banners/CMS", to: "/cms" },
    { icon: Settings, label: "Cài đặt", to: "/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-neutral-100 flex flex-col z-50">
      <div className="p-8">
        <h1 className="text-xl font-serif tracking-tighter text-neutral-900">TENCLOTHES</h1>
        <p className="text-[9px] text-neutral-400 uppercase tracking-[0.2em] mt-1">Admin Management</p>
      </div>

      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={location.pathname === item.to}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-50">
        <div className="flex items-center gap-3 mb-6 px-4">
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-serif italic text-neutral-600">
            {admin?.fullName?.charAt(0) || "A"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[11px] font-semibold text-neutral-900 truncate">{admin?.fullName || "Administrator"}</span>
            <span className="text-[9px] text-neutral-400 uppercase tracking-widest">{admin?.role || "Owner"}</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300 text-[10px] font-medium uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
