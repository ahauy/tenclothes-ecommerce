import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Search, Bell, Mail, Menu } from "lucide-react";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FBFBFB] font-sans overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-all duration-500 w-full">
        {/* Header */}
        <header className="h-20 bg-white border-b border-neutral-100 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-40 w-full">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative group w-full max-w-md hidden md:block">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
              <input 
                type="text" 
                placeholder="TÌM KIẾM HỆ THỐNG..." 
                className="w-full bg-transparent pl-8 pr-4 py-2 text-[10px] font-bold tracking-[0.2em] outline-none border-b border-transparent focus:border-neutral-900 transition-all placeholder:text-neutral-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <button className="relative group hidden xs:block">
                <Mail className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-neutral-900 rounded-full border-2 border-white shadow-sm" />
              </button>
              <button className="relative group">
                <Bell className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-neutral-900 rounded-full border-2 border-white shadow-sm" />
              </button>
            </div>
            <div className="h-6 w-[1.5px] bg-neutral-100 mx-1 sm:mx-2 hidden sm:block" />
            <div className="flex items-center gap-3 cursor-pointer group">
              <span className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-neutral-400 group-hover:text-neutral-900 transition-colors whitespace-nowrap">EN // USD</span>
            </div>
          </div>
        </header>

        {/* Page Content - Full Width Fluid */}
        <div className="p-4 sm:p-6 lg:p-10 flex-1 w-full">
          {children}
        </div>

        {/* Footer */}
        <footer className="p-6 sm:p-10 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6 text-neutral-400 text-[10px] font-bold tracking-widest text-center w-full">
          <p>© 2026 TENCLOTHES SYSTEM. PRIVACY & SECURITY.</p>
          <div className="flex gap-6 sm:gap-10">
            <a href="#" className="hover:text-neutral-900 transition-colors border-b border-transparent hover:border-neutral-900">SUPPORT</a>
            <a href="#" className="hover:text-neutral-900 transition-colors border-b border-transparent hover:border-neutral-900">API DOCS</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default MainLayout;
