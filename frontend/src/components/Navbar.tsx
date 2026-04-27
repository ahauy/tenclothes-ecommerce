import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState } from "react";
import Search from "./Search";
import { useAuthStore } from "../stores/useAuthStore";
import { useShopStore } from "../stores/useShopStore";
import { useCartStore } from "../stores/useCartStore";
import CategoryMenu from "./category/CategoryMenu";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const setOpenModal = useShopStore((state) => state.setOpenModal)
  const cartItems = useCartStore((state) => state.cartItems)

  let quantityProduct: number = 0
  if(cartItems) {
    quantityProduct = cartItems.reduce((acc, cur) => {
      return acc + cur.quantity
    }, 0)
  }

  const accessToken = useAuthStore((state) => state.accessToken)
  const logOut = useAuthStore((state) => state.logOut)

  return (
    <div className="sm:sticky sm:z-99 top-0 sm:bg-white sm:border-b">
      <Search />
      <div className="flex items-center justify-between py-5 font-medium">
        <Link to="/">
          <img src={assets.logo} className="w-36" alt="Logo" />
        </Link>

        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink to="/" className="flex flex-col items-center gap-1 py-4">
            <p className="hover:text-[#ff4500]">TRANG CHỦ</p>
          </NavLink>
          <CategoryMenu />
          <NavLink to="/about" className="flex flex-col items-center gap-1 py-4">
            <p className="hover:text-[#ff4500]">GIỚI THIỆU</p>
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center gap-1 py-4">
            <p className="hover:text-[#ff4500]">LIÊN HỆ</p>
          </NavLink>
        </ul>

        <div className="flex items-center gap-6">
          <img
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="Search"
            onClick={() => {
              setOpenModal(true);
            }}
          />

          <div className="group relative">
            {accessToken ? (
              <>
                <img
                  className="w-5 cursor-pointer"
                  src={assets.profile_icon}
                  alt="Profile"
                />
                <div className="group-hover:block hidden absolute right-0 pt-4">
                  <div className="flex flex-col gap-2 w-40 py-3 px-5 bg-slate-200 text-gray-600 rounded shadow-lg z-50">
                    <Link to="/account/profile" className="cursor-pointer hover:text-black">
                      Thông tin cá nhân
                    </Link>
                    <Link to="/account/orders" className="cursor-pointer hover:text-black">
                      Lịch sử đặt hàng
                    </Link>
                    <Link to="/account/addresses" className="cursor-pointer hover:text-black">
                      Sổ địa chỉ
                    </Link>
                    <p className="cursor-pointer hover:text-black" onClick={logOut}>Đăng xuất</p>
                  </div>
                </div>
              </>
            ) : (
              <NavLink to="/login">
                <img
                  className="w-5 cursor-pointer"
                  src={assets.profile_icon}
                  alt="Profile"
                />
              </NavLink>
            )}
          </div>

          <Link to="/cart" className="relative">
            <img
              className="w-5 cursor-pointer"
              src={assets.cart_icon}
              alt="Cart"
            />
            <p className="absolute -right-1.25 -bottom-1.25 text-white text-[8px] bg-black aspect-square rounded-full w-4 text-center leading-4">
              {quantityProduct}
            </p>
          </Link>

          <img
            className="w-5 cursor-pointer sm:hidden"
            src={assets.menu_icon}
            alt="Dropdown menu"
            onClick={() => setVisible(true)}
          />
        </div>

        {/* Sidebar menu for small screen */}
        <div
          className={`absolute top-0 right-0 bottom-0 h-full overflow-hidden bg-white z-90 ${
            visible ? "w-full" : "w-0"
          }`}
        >
          <div className="flex flex-col gap-5 text-gray-600 p-4">
            <div
              className="flex gap-5 items-center cursor-pointer"
              onClick={() => setVisible(false)}
            >
              <img
                className="h-4 rotate-180"
                src={assets.dropdown_icon}
                alt="Back"
              />
              <p className="text-gray-600">Back</p>
            </div>

            <NavLink
              to="/"
              onClick={() => setVisible(false)}
              className="py-3 pl-6 border"
            >
              HOME
            </NavLink>
            <NavLink
              to="/collection"
              onClick={() => setVisible(false)}
              className="py-3 pl-6 border"
            >
              COLLECTION
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setVisible(false)}
              className="py-3 pl-6 border"
            >
              ABOUT
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setVisible(false)}
              className="py-3 pl-6 border"
            >
              CONTACT
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
