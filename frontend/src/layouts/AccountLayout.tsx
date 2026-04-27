import React from 'react';
import { NavLink } from 'react-router-dom';

interface AccountLayoutProps {
  children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 py-8 md:py-12 min-h-[70vh] bg-[#0A0A0A] text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 bg-[#141414] border border-neutral-800 flex flex-col font-noto-serif uppercase tracking-widest h-fit">
        <div className="p-6 border-b border-neutral-800">
          <h2 className="text-2xl font-normal mb-1 text-white">ACCOUNT</h2>
          <p className="font-body-md text-[10px] text-neutral-500 capitalize tracking-normal">Quản lý tài khoản của bạn</p>
        </div>
        
        <nav className="flex flex-col text-xs">
          <NavLink
            to="/account/profile"
            className={({ isActive }) =>
              `px-6 py-4 flex items-center gap-4 transition-all ease-in-out duration-200 hover:bg-[#1A1A1A] ${
                isActive
                  ? 'text-white font-bold bg-[#1A1A1A] border-l-2 border-white'
                  : 'text-neutral-500'
              }`
            }
          >
            <span className="material-symbols-outlined">person</span>
            Hồ sơ cá nhân
          </NavLink>
          
          <NavLink
            to="/account/orders"
            className={({ isActive }) =>
              `px-6 py-4 flex items-center gap-4 transition-all ease-in-out duration-200 hover:bg-[#1A1A1A] ${
                isActive
                  ? 'text-white font-bold bg-[#1A1A1A] border-l-2 border-white'
                  : 'text-neutral-500'
              }`
            }
          >
            <span className="material-symbols-outlined">package_2</span>
            Lịch sử đơn hàng
          </NavLink>
          
          <NavLink
            to="/account/addresses"
            className={({ isActive }) =>
              `px-6 py-4 flex items-center gap-4 transition-all ease-in-out duration-200 hover:bg-[#1A1A1A] ${
                isActive
                  ? 'text-white font-bold bg-[#1A1A1A] border-l-2 border-white'
                  : 'text-neutral-500'
              }`
            }
          >
            <span className="material-symbols-outlined">location_on</span>
            Sổ địa chỉ
          </NavLink>
          
          <a
            href="#"
            className="px-6 py-4 flex items-center gap-4 transition-all ease-in-out duration-200 text-neutral-500 hover:bg-[#1A1A1A]"
          >
            <span className="material-symbols-outlined">favorite</span>
            Danh sách yêu thích
          </a>
          
          <a
            href="#"
            className="px-6 py-4 flex items-center gap-4 transition-all ease-in-out duration-200 text-neutral-500 hover:bg-[#1A1A1A]"
          >
            <span className="material-symbols-outlined">settings</span>
            Cài đặt
          </a>
        </nav>
        
        <div className="mt-auto border-t border-neutral-800 text-xs">
          <button
            className="w-full px-6 py-4 flex items-center gap-4 transition-all ease-in-out duration-200 text-neutral-500 hover:bg-[#1A1A1A] uppercase text-left tracking-widest"
          >
            <span className="material-symbols-outlined">logout</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full bg-[#0A0A0A] p-0 md:pl-8">
        {children}
      </main>
    </div>
  );
};

export default AccountLayout;
