import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Order from "./pages/Order";
import PlaceOrder from "./pages/PlaceOrder";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignUp from "./pages/SignUp";
import { Toaster } from "sonner";
import { useAuthStore } from "./stores/useAuthStore";
import { useEffect } from "react";
import MoMoReturn from "./pages/MomoReturn";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import AccountLayout from "./layouts/AccountLayout";
import Profile from "./pages/account/Profile";
import Addresses from "./pages/account/Addresses";
import Orders from "./pages/account/Orders";
import Search from "./components/Search";

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] flex flex-col min-h-screen">
      <Toaster richColors position="top-right" expand={false} />
      <Search />
      <Navbar></Navbar>
      <div className="grow">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          {/* <Route path="/collection" element={<Collection />}></Route> */}
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/product/:slug" element={<Product />}></Route>
          <Route path="/collection/:slug" element={<Collection />}/>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
          <Route path="/order" element={<Order />}></Route>
          <Route path="/momo-return" element={<MoMoReturn />}></Route>
          <Route path="/place-order" element={<PlaceOrder />}></Route>
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/account/profile" element={<AccountLayout><Profile /></AccountLayout>} />
          <Route path="/account/addresses" element={<AccountLayout><Addresses /></AccountLayout>} />
          <Route path="/account/orders" element={<AccountLayout><Orders /></AccountLayout>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
