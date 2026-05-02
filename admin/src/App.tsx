import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Staff from "./pages/Staff";
import Permissions from "./pages/Permissions";
import MainLayout from "./layouts/MainLayout";
import { useAuthStore } from "./stores/useAuthStore";
import { Loader2 } from "lucide-react";

const App = () => {
  const { accessToken, isAuthLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900 mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
          Authenticating Experience
        </p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route 
        path="/login" 
        element={!accessToken ? <Login /> : <Navigate to="/" replace />} 
      />
      
      {/* Protected Routes Wrapper */}
      <Route 
        path="/*" 
        element={
          accessToken ? (
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/permissions" element={<Permissions />} />
                {/* Fallback cho các trang chưa làm */}
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center h-[60vh]">
                    <h2 className="text-4xl font-serif text-neutral-200 uppercase tracking-widest">Coming Soon</h2>
                    <p className="text-neutral-400 text-[10px] font-bold tracking-[0.3em] mt-4">Trang này đang được thiết kế theo chuẩn Luxury</p>
                  </div>
                } />
              </Routes>
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
};

export default App;
