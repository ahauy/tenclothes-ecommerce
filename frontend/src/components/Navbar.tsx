import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useShopStore } from "../stores/useShopStore";
import { useCartStore } from "../stores/useCartStore";
import CategoryMenu from "./category/CategoryMenu"; // Đảm bảo đường dẫn này đúng theo folder của bạn

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const setOpenModal = useShopStore((state) => state.setOpenModal);
  const cartItems = useCartStore((state) => state.cartItems);
  const accessToken = useAuthStore((state) => state.accessToken);
  const logOut = useAuthStore((state) => state.logOut);

  let quantityProduct: number = 0;
  if (cartItems) {
    quantityProduct = cartItems.reduce((acc, cur) => {
      return acc + cur.quantity;
    }, 0);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setVisible(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const handleLogout = () => {
    setUserMenuOpen(false);
    logOut();
  };

  return (
    <div className="font-manrope">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Manrope', sans-serif;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes fadeInOverlay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }

        .animate-fade-in-overlay {
          animation: fadeInOverlay 0.3s ease-out forwards;
        }

        .dropdown-item {
          transition: all 0.15s ease;
        }

        .dropdown-item:hover {
          background-color: #f9fafb;
        }

        .mobile-nav-item {
          transition: all 0.2s ease;
        }

        .mobile-nav-item:hover {
          background-color: #f3f4f6;
          padding-left: 1.5rem;
        }

        .mobile-nav-item:active {
          background-color: #e5e7eb;
        }

        .nav-link {
          position: relative;
          transition: color 0.2s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1.5px;
          background-color: #1a1a1a;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .cart-badge {
          animation: fadeIn 0.3s ease-out;
        }

        .icon-wrapper {
          transition: all 0.2s ease;
        }

        .icon-wrapper:hover {
          transform: scale(1.1);
        }

        .icon-wrapper:active {
          transform: scale(0.95);
        }
      `}</style>

      <nav className="bg-white text-black border-b border-neutral-200 sticky top-0 z-40">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="shrink-0 icon-wrapper">
            <img src={assets.logo} className="w-32 sm:w-36 h-auto" alt="Logo" />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
            <NavLink to="/" className="flex flex-col items-center gap-1 py-4">
              <p className="hover:text-[#ff4500]">TRANG CHỦ</p>
            </NavLink>
            {/* Truyền mặc định (không isMobile) để render Mega Menu */}
            <CategoryMenu isMobile={false} />
            <NavLink
              to="/about"
              className="flex flex-col items-center gap-1 py-4"
            >
              <p className="hover:text-[#ff4500]">GIỚI THIỆU</p>
            </NavLink>
            <NavLink
              to="/contact"
              className="flex flex-col items-center gap-1 py-4"
            >
              <p className="hover:text-[#ff4500]">LIÊN HỆ</p>
            </NavLink>
          </ul>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search */}
            <button
              className="icon-wrapper p-2 rounded-full hover:bg-neutral-100 transition-colors duration-200"
              onClick={() => setOpenModal(true)}
              aria-label="Search"
            >
              <img src={assets.search_icon} className="w-5 h-5" alt="Search" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              {accessToken ? (
                <div>
                  <button
                    className="icon-wrapper p-2 rounded-full hover:bg-neutral-100 transition-colors duration-200 flex items-center gap-2"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="User menu"
                    aria-expanded={userMenuOpen}
                  >
                    <img
                      className="w-5 h-5"
                      src={assets.profile_icon}
                      alt="Profile"
                    />
                    <svg
                      className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu - Light Theme */}
                  {userMenuOpen && (
                    <div className="animate-fade-in absolute right-0 top-full mt-2 w-72 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
                        <p className="text-sm font-semibold text-black">
                          Tài khoản của tôi
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Quản lý Hồ sơ cá nhân
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/account/profile"
                          className="dropdown-item flex items-center gap-3 px-5 py-3 text-sm text-neutral-600 hover:text-black hover:bg-neutral-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg
                            className="w-4 h-4 text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Hồ sơ cá nhân</span>
                        </Link>

                        <Link
                          to="/account/orders"
                          className="dropdown-item flex items-center gap-3 px-5 py-3 text-sm text-neutral-600 hover:text-black hover:bg-neutral-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg
                            className="w-4 h-4 text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          <span>Lịch sử đặt hàng</span>
                        </Link>

                        <Link
                          to="/account/addresses"
                          className="dropdown-item flex items-center gap-3 px-5 py-3 text-sm text-neutral-600 hover:text-black hover:bg-neutral-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg
                            className="w-4 h-4 text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Sổ địa chỉ</span>
                        </Link>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-neutral-200" />

                      {/* Logout */}
                      <div className="py-2">
                        <button
                          className="dropdown-item w-full flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={handleLogout}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="icon-wrapper p-2 rounded-full hover:bg-neutral-100 transition-colors duration-200"
                  aria-label="Login"
                >
                  <img
                    className="w-5 h-5"
                    src={assets.profile_icon}
                    alt="Profile"
                  />
                </Link>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="icon-wrapper relative p-2 rounded-full hover:bg-neutral-100 transition-colors duration-200"
              aria-label={`Cart with ${quantityProduct} items`}
            >
              <img className="w-5 h-5" src={assets.cart_icon} alt="Cart" />
              {quantityProduct > 0 && (
                <span className="cart-badge absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold aspect-square rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {quantityProduct > 99 ? "99+" : quantityProduct}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="icon-wrapper p-2 rounded-full hover:bg-neutral-100 transition-colors duration-200 lg:hidden"
              onClick={() => setVisible(true)}
              aria-label="Open menu"
            >
              <img className="w-5 h-5" src={assets.menu_icon} alt="Menu" />
            </button>
          </div>
        </div>
        {/* Mobile Menu Overlay */}
        {visible && (
          <div
            className="animate-fade-in-overlay fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setVisible(false)}
          />
        )}

        {/* Mobile Menu Sidebar */}
        <div
          className={`fixed top-0 right-0 bottom-0 h-full bg-white z-50 overflow-y-auto transition-all duration-300 ease-out lg:hidden ${
            visible ? "w-full sm:w-80 translate-x-0" : "w-80 translate-x-full"
          }`}
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <span className="text-sm font-semibold uppercase tracking-wider text-black">
              Menu
            </span>
            <button
              className="p-2 rounded-full hover:bg-neutral-100 transition-colors duration-200"
              onClick={() => setVisible(false)}
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5 text-neutral-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Items */}
          <div className="flex flex-col py-2">
            <NavLink
              to="/"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `mobile-nav-item flex items-center gap-3 px-6 py-3.5 text-sm text-neutral-600 hover:text-black ${
                  isActive
                    ? "bg-neutral-50 text-black border-l-2 border-black"
                    : "border-l-2 border-transparent"
                }`
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium tracking-wide uppercase text-xs">
                Trang chủ
              </span>
            </NavLink>

            {/* Gọi CategoryMenu chuyên biệt cho Mobile (isMobile={true}) thay vì gọi theo cụm padding */}
            <CategoryMenu isMobile={true} setVisible={setVisible} />

            <NavLink
              to="/about"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `mobile-nav-item flex items-center gap-3 px-6 py-3.5 text-sm text-neutral-600 hover:text-black ${
                  isActive
                    ? "bg-neutral-50 text-black border-l-2 border-black"
                    : "border-l-2 border-transparent"
                }`
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium tracking-wide uppercase text-xs">
                Giới thiệu
              </span>
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `mobile-nav-item flex items-center gap-3 px-6 py-3.5 text-sm text-neutral-600 hover:text-black ${
                  isActive
                    ? "bg-neutral-50 text-black border-l-2 border-black"
                    : "border-l-2 border-transparent"
                }`
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium tracking-wide uppercase text-xs">
                Liên hệ
              </span>
            </NavLink>
          </div>

          {/* Mobile Menu Divider */}
          <div className="border-t border-neutral-200 my-2" />

          {/* Mobile User Actions */}
          <div className="flex flex-col py-2">
            {accessToken ? (
              <>
                <Link
                  to="/account/profile"
                  onClick={() => setVisible(false)}
                  className="mobile-nav-item flex items-center gap-3 px-6 py-3.5 text-sm text-neutral-600 hover:text-black"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium tracking-wide uppercase text-xs">
                    Hồ sơ cá nhân
                  </span>
                </Link>

                <Link
                  to="/account/orders"
                  onClick={() => setVisible(false)}
                  className="mobile-nav-item flex items-center gap-3 px-6 py-3.5 text-sm text-neutral-600 hover:text-black"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span className="font-medium tracking-wide uppercase text-xs">
                    Lịch sử đặt hàng
                  </span>
                </Link>

                <Link
                  to="/account/addresses"
                  onClick={() => setVisible(false)}
                  className="mobile-nav-item flex items-center gap-3 px-6 py-3.5 text-sm text-neutral-600 hover:text-black"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium tracking-wide uppercase text-xs">
                    Sổ địa chỉ
                  </span>
                </Link>

                <div className="border-t border-neutral-200 my-2" />

                <button
                  onClick={() => {
                    setVisible(false);
                    handleLogout();
                  }}
                  className="mobile-nav-item flex items-center gap-3 px-6 py-3.5 text-sm text-red-500 hover:text-red-600 w-full text-left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium tracking-wide uppercase text-xs">
                    Đăng xuất
                  </span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setVisible(false)}
                className="mobile-nav-item flex items-center gap-3 px-6 py-3.5 text-sm text-neutral-600 hover:text-black"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium tracking-wide uppercase text-xs">
                  Đăng nhập
                </span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;