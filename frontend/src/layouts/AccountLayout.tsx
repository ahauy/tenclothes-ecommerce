import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';``
import { useAuthStore } from '../stores/useAuthStore';

interface AccountLayoutProps {
  children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {

  const logout = useAuthStore(s => s.logOut)

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 py-8 md:py-12 h-fit text-black">  
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 bg-white flex flex-col font-noto-serif uppercase tracking-widest max-h-100">
        <div className="pb-10">
          <h2 className="text-2xl font-normal mb-1 text-black">TÀI KHOẢN</h2>
          <p className="font-body-md text-[10px] text-neutral-500 capitalize tracking-normal">Quản lý tài khoản của bạn</p>
        </div>
        
        <nav className="flex flex-col text-xs flex-1">
          <NavLink
            to="/account/profile"
            className={({ isActive }) =>
              `px-6 py-4 flex items-center gap-4 transition-all ease-in-out duration-200 hover:bg-[#f8f9ff] ${
                isActive
                  ? 'text-black font-bold bg-[#f8f9ff] border-l-2 border-black'
                  : 'text-neutral-500'
              }`
            }
          >
            Hồ sơ cá nhân
          </NavLink>
          
          <NavLink
            to="/account/orders"
            className={({ isActive }) =>
              `px-6 py-4 flex items-center gap-4 transition-all ease-in-out duration-200 hover:bg-[#f8f9ff] ${
                isActive
                  ? 'text-black font-bold bg-[#f8f9ff] border-l-2 border-black'
                  : 'text-neutral-500'
              }`
            }
          >
            Lịch sử đơn hàng
          </NavLink>
          
          <NavLink
            to="/account/addresses"
            className={({ isActive }) =>
              `px-6 py-4 flex items-center gap-4 transition-all ease-in-out duration-200 hover:bg-[#f8f9ff] ${
                isActive
                  ? 'text-black font-bold bg-[#f8f9ff] border-l-2 border-black'
                  : 'text-neutral-500'
              }`
            }
          >
            Sổ địa chỉ
          </NavLink>
          
          <a
            href="#"
            className="px-6 py-4 flex items-center gap-4 transition-all ease-in-out duration-200 text-neutral-500 hover:bg-[#f8f9ff]"
          >
            Danh sách yêu thích
          </a>
          
          <a
            href="#"
            className="px-6 py-4 flex items-center gap-4 transition-all ease-in-out duration-200 text-neutral-500 hover:bg-[#f8f9ff]"
          >
            Cài đặt
          </a>
        </nav>
        
        <div className="mt-auto border-t border-neutral-800 text-xs">
          <button
            className="w-full px-6 py-4 flex items-center gap-4 transition-all ease-in-out duration-200 text-neutral-500 hover:bg-[#f8f9ff] hover:text-red-500 uppercase text-left tracking-widest"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full p-0 md:pl-8">
        {children}
      </main>
    </div>
  );
};

export default AccountLayout;
