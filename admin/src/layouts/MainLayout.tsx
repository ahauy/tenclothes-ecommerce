import React from "react";
import Sidebar from "./Sidebar";
import { Search, Bell, Mail } from "lucide-react";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#FBFBFB] font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-neutral-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="relative group w-96">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
            <input 
              type="text" 
              placeholder="TÌM KIẾM ĐƠN HÀNG, SẢN PHẨM..." 
              className="w-full bg-transparent pl-8 pr-4 py-2 text-[10px] font-bold tracking-widest outline-none border-b border-transparent focus:border-neutral-900 transition-all placeholder:text-neutral-300"
            />
          </div>

          <div className="flex items-center gap-8">
            <button className="relative group">
              <Mail className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-neutral-900 rounded-full border-2 border-white" />
            </button>
            <button className="relative group">
              <Bell className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-neutral-900 rounded-full border-2 border-white" />
            </button>
            <div className="h-6 w-[1px] bg-neutral-100 mx-2" />
            <div className="flex items-center gap-3 cursor-pointer group">
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 group-hover:text-neutral-900 transition-colors">EN / USD</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-10 flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="p-10 border-t border-neutral-100 flex justify-between items-center text-neutral-400 text-[10px] font-medium tracking-widest">
          <p>© 2026 TENCLOTHES SYSTEM. PRIVACY POLICY.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-neutral-900 transition-colors">HỖ TRỢ</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">TÀI LIỆU API</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default MainLayout;
