import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { userServices, type IAddress } from "../../services/userService";
import { useAuthStore } from "../../stores/useAuthStore";
import AddressFormModal from "../../components/AddressFormModal";
import { useCheckoutInforStore } from "../../stores/useCheckoutInforStore";

// ---- Skeleton ----
const AddressSkeleton: React.FC = () => (
  <div className="bg-white border border-[#e5e7eb] p-6 sm:p-8 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <div className="flex gap-3 items-center">
          <div className="h-5 w-32 bg-[#f3f4f6] rounded" />
          <div className="h-5 w-16 bg-[#f3f4f6] rounded" />
        </div>
        <div className="h-4 w-28 bg-[#f3f4f6] rounded" />
        <div className="h-4 w-3/4 bg-[#f3f4f6] rounded" />
      </div>
      <div className="flex gap-4">
        <div className="h-4 w-14 bg-[#f3f4f6] rounded" />
        <div className="h-4 w-10 bg-[#f3f4f6] rounded" />
      </div>
    </div>
  </div>
);

// ---- Empty State ----
const EmptyState: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <div className="bg-white border border-[#e5e7eb] p-12 sm:p-16 text-center">
    <div className="w-16 h-16 bg-[#f7f8fa] border border-[#e5e7eb] flex items-center justify-center mx-auto mb-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-[#9ca3af]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>
    <p className="text-[#1a1a1a] font-medium text-lg mb-2">Bạn chưa có địa chỉ nào</p>
    <p className="text-[#9ca3af] text-sm mb-8">
      Thêm địa chỉ giao hàng để thanh toán nhanh hơn.
    </p>
    <button
      onClick={onAdd}
      className="inline-block bg-[#1a1a1a] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 hover:bg-[#333] transition-colors"
    >
      + Thêm địa chỉ đầu tiên
    </button>
  </div>
);

// ---- Main Component ----
const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);

  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await userServices.getAddresses(accessToken!);
      setAddresses(res.data.data ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách địa chỉ!");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!isAuthLoading) {
      if (accessToken) {
        fetchAddresses();
      } else {
        setIsLoading(false);
      }
    }
  }, [isAuthLoading, accessToken, fetchAddresses]);

  const openAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const openEditModal = (address: IAddress) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (updatedAddresses: IAddress[]) => {
    setAddresses(updatedAddresses);
  };

  const handleDelete = async (addressId: string) => {
    try {
      setDeletingId(addressId);
      const res = await userServices.deleteAddress(accessToken!, addressId);
      setAddresses(res.data.data ?? []);
      toast.success("Đã xóa địa chỉ!");
    } catch (error) {
      // const msg = error?.response?.data?.message || "Không thể xóa địa chỉ này!";
      console.error(error)
      toast.error( "Không thể xóa địa chỉ này!");
    } finally {
      setDeletingId(null);
    }
  };

  const setCheckoutField = useCheckoutInforStore((state) => state.setField);

  const handleSetDefault = async (addressId: string) => {
    try {
      setSettingDefaultId(addressId);
      const res = await userServices.setDefaultAddress(accessToken!, addressId);
      const updatedAddresses = res.data.data ?? [];
      setAddresses(updatedAddresses);
      
      // Đồng bộ địa chỉ mới chọn làm mặc định xuống LocalStorage
      const newDefault = updatedAddresses.find((addr: IAddress) => addr._id === addressId);
      if (newDefault) {
        setCheckoutField("fullName", newDefault.name);
        setCheckoutField("phone", newDefault.phone);
        setCheckoutField("province", String(newDefault.province));
        setCheckoutField("district", String(newDefault.district));
        setCheckoutField("ward", String(newDefault.ward));
        setCheckoutField("detailAddress", newDefault.address);
      }

      toast.success("Đã đặt làm địa chỉ mặc định!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể thay đổi địa chỉ mặc định!");
    } finally {
      setSettingDefaultId(null);
    }
  };

  const formatAddress = (addr: IAddress) =>
    [addr.address, addr.ward, addr.district, addr.province].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-manrope w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Manrope', sans-serif; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-delay-1 { animation-delay: 0.05s; opacity: 0; }
        .animate-delay-2 { animation-delay: 0.1s; opacity: 0; }
        .animate-delay-3 { animation-delay: 0.15s; opacity: 0; }
        .card-hover { transition: box-shadow 0.3s ease; }
        .card-hover:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Header */}
        <div className="animate-fade-in-up mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-[#1a1a1a] tracking-tight">
                Sổ Địa Chỉ
              </h1>
              <p className="mt-2 text-[#8a8f98] text-sm sm:text-base">
                Quản lý danh sách địa chỉ giao hàng của bạn.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="shrink-0 bg-[#1a1a1a] text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 hover:bg-[#333] transition-colors"
            >
              + Thêm địa chỉ mới
            </button>
          </div>
          <div className="mt-6 h-px bg-[#e5e7eb]" />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => <AddressSkeleton key={n} />)}
          </div>
        ) : addresses.length === 0 ? (
          <EmptyState onAdd={openAddModal} />
        ) : (
          <div className="space-y-4">
            {addresses.map((addr, index) => (
              <div
                key={addr._id}
                className={`animate-fade-in-up bg-white border card-hover animate-delay-${Math.min(index + 1, 3)} ${
                  addr.isDefault ? "border-[#1a1a1a]" : "border-[#e5e7eb]"
                }`}
              >
                <div className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start gap-5">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-base font-semibold text-[#1a1a1a] tracking-wide">
                        {addr.name}
                      </span>
                      {addr.isDefault && (
                        <span className="bg-[#1a1a1a] text-white text-[10px] px-2.5 py-1 uppercase tracking-widest font-bold">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#6b7280] font-medium mb-1">{addr.phone}</p>
                    <p className="text-sm text-[#9ca3af] leading-relaxed">{formatAddress(addr)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 shrink-0">
                    {/* Set Default Button */}
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr._id)}
                        disabled={settingDefaultId === addr._id}
                        className="text-xs font-semibold text-[#6b7280] hover:text-[#1a1a1a] transition-colors uppercase tracking-wider border border-[#e5e7eb] px-3 py-1.5 hover:border-[#1a1a1a] disabled:opacity-40"
                      >
                        {settingDefaultId === addr._id ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 border-2 border-[#9ca3af]/30 border-t-[#9ca3af] rounded-full animate-spin" />
                            Đang xử lý
                          </span>
                        ) : (
                          "Đặt mặc định"
                        )}
                      </button>
                    )}

                    {/* Edit Button */}
                    <button
                      onClick={() => openEditModal(addr)}
                      className="text-xs font-bold text-[#1a1a1a] hover:text-[#6b7280] transition-colors underline decoration-1 underline-offset-4 uppercase tracking-wider"
                    >
                      Cập nhật
                    </button>

                    {/* Delete Button — ẩn nếu là default */}
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleDelete(addr._id)}
                        disabled={deletingId === addr._id}
                        className="text-xs font-bold text-[#9ca3af] hover:text-rose-500 transition-colors underline decoration-1 underline-offset-4 uppercase tracking-wider disabled:opacity-40"
                      >
                        {deletingId === addr._id ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 border-2 border-rose-200 border-t-rose-400 rounded-full animate-spin" />
                            Xóa
                          </span>
                        ) : (
                          "Xóa"
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Default indicator bar */}
                {addr.isDefault && (
                  <div className="h-0.5 bg-[#1a1a1a] w-full" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Hint về địa chỉ mặc định */}
        {addresses.length > 0 && (
          <p className="mt-6 text-xs text-[#9ca3af] text-center">
            Địa chỉ mặc định sẽ được tự động điền khi bạn thanh toán.
            <Link to="/" className="ml-1 underline hover:text-[#1a1a1a] transition-colors">
              Mua sắm ngay →
            </Link>
          </p>
        )}

        <div className="h-8" />
      </div>

      {/* AddressFormModal */}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }}
        initialData={editingAddress}
        onSuccess={handleModalSuccess}
        accessToken={accessToken!}
      />
    </div>
  );
};

export default Addresses;