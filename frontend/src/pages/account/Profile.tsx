import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/useAuthStore';
import { userServices } from '../../services/userService';
import type { IUserProfile } from '../../interfaces/iAuthState';

// ---- Loading Spinner ----
const Spinner: React.FC = () => (
  <svg
    className="animate-spin h-4 w-4 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

// ---- Password Toggle Input ----
interface PasswordInputProps {
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id, name, placeholder, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent border border-[#d1d5db] px-4 py-2.5 pr-12 text-[#1a1a1a] text-sm focus:outline-none input-focus-effect transition-all duration-200 placeholder:text-[#d1d5db]"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
};

// ---- Main Component ----
const Profile: React.FC = () => {
  const { accessToken, user, setUser } = useAuthStore();

  // -- Personal Info State --
  const [personalData, setPersonalData] = useState({
    fullName: '',
    phone: '',
    gender: '' as IUserProfile['gender'],
    dob: '',
    height: '',
    weight: '',
  });
  const [isPersonalLoading, setIsPersonalLoading] = useState(false);

  // -- Password State --
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // -- Load user data from store --
  useEffect(() => {
    if (user) {
      setPersonalData({
        fullName: user.fullName ?? '',
        phone: user.phone ?? '',
        gender: user.gender ?? '',
        dob: user.info?.dob ?? '',
        height: user.info?.height ?? '',
        weight: user.info?.weight ?? '',
      });
    }
  }, [user]);

  // -- Handlers --
  const handlePersonalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalData.fullName.trim()) {
      toast.error('Vui lòng nhập họ tên!');
      return;
    }
    setIsPersonalLoading(true);
    try {
      const res = await userServices.updateProfile(accessToken, {
        fullName: personalData.fullName,
        phone: personalData.phone,
        gender: personalData.gender || undefined,
        dob: personalData.dob,
        height: personalData.height,
        weight: personalData.weight,
      });
      // Đồng bộ store
      setUser(res.data.data as IUserProfile);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError?.response?.data?.message ?? 'Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setIsPersonalLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không trùng khớp!');
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('Mật khẩu mới phải khác mật khẩu hiện tại!');
      return;
    }
    setIsPasswordLoading(true);
    try {
      await userServices.changePassword(accessToken, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      toast.success('Đổi mật khẩu thành công!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordFields(false);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError?.response?.data?.message ?? 'Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-manrope">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Manrope', sans-serif; }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.5);
          cursor: pointer;
        }

        .input-focus-effect:focus {
          border-color: #1a1a1a !important;
          box-shadow: 0 0 0 1px #1a1a1a !important;
        }

        .card-hover { transition: box-shadow 0.3s ease; }
        .card-hover:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.06); }

        .btn-primary { transition: all 0.3s ease; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }

        .btn-secondary { transition: all 0.3s ease; }
        .btn-secondary:hover { background-color: #1a1a1a; color: white; transform: translateY(-1px); }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-delay-1 { animation-delay: 0.1s; opacity: 0; }
        .animate-delay-2 { animation-delay: 0.2s; opacity: 0; }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Header */}
        <div className="animate-fade-in-up mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#1a1a1a] tracking-tight">
            Hồ Sơ Cá Nhân
          </h1>
          <p className="mt-2 text-[#8a8f98] text-sm sm:text-base">
            Cập nhật thông tin cá nhân và tài khoản của bạn.
          </p>
          <div className="mt-6 h-px bg-[#e5e7eb]" />
        </div>

        {/* ---- Personal Information ---- */}
        <div className="animate-fade-in-up animate-delay-1">
          <div className="bg-white rounded-none border border-[#e5e7eb] p-6 sm:p-8 md:p-10 card-hover">
            <h2 className="text-xl sm:text-2xl font-medium text-[#1a1a1a] mb-6 pb-4 border-b border-[#e5e7eb]">
              Thông Tin Cá Nhân
            </h2>

            <form onSubmit={handlePersonalSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">

                {/* Họ và Tên */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={personalData.fullName}
                    onChange={handlePersonalChange}
                    placeholder="Nhập họ và tên"
                    className="w-full bg-transparent border border-[#d1d5db] px-4 py-2.5 text-[#1a1a1a] text-sm focus:outline-none input-focus-effect transition-all duration-200 placeholder:text-[#d1d5db]"
                  />
                </div>

                {/* Số điện thoại */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={personalData.phone}
                    onChange={handlePersonalChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full bg-transparent border border-[#d1d5db] px-4 py-2.5 text-[#1a1a1a] text-sm focus:outline-none input-focus-effect transition-all duration-200 placeholder:text-[#d1d5db]"
                  />
                </div>

                {/* Giới tính */}
                <div className="space-y-2">
                  <label htmlFor="gender" className="block text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
                    Giới Tính
                  </label>
                  <div className="relative">
                    <select
                      id="gender"
                      name="gender"
                      value={personalData.gender}
                      onChange={handlePersonalChange}
                      className="w-full bg-transparent border border-[#d1d5db] px-4 py-2.5 text-[#1a1a1a] text-sm focus:outline-none input-focus-effect transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="">-- Chọn giới tính --</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg className="w-4 h-4 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Ngày sinh */}
                <div className="space-y-2">
                  <label htmlFor="dob" className="block text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
                    Ngày Sinh
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={personalData.dob}
                    onChange={handlePersonalChange}
                    className="w-full bg-transparent border border-[#d1d5db] px-4 py-2.5 text-[#1a1a1a] text-sm focus:outline-none input-focus-effect transition-all duration-200"
                  />
                </div>

                {/* Chiều cao */}
                <div className="space-y-2">
                  <label htmlFor="height" className="block text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
                    Chiều Cao (CM)
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={personalData.height}
                    onChange={handlePersonalChange}
                    placeholder="Nhập chiều cao"
                    min="0"
                    max="300"
                    className="w-full bg-transparent border border-[#d1d5db] px-4 py-2.5 text-[#1a1a1a] text-sm focus:outline-none input-focus-effect transition-all duration-200 placeholder:text-[#d1d5db]"
                  />
                </div>

                {/* Cân nặng */}
                <div className="space-y-2">
                  <label htmlFor="weight" className="block text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
                    Cân Nặng (KG)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={personalData.weight}
                    onChange={handlePersonalChange}
                    placeholder="Nhập cân nặng"
                    min="0"
                    max="500"
                    className="w-full bg-transparent border border-[#d1d5db] px-4 py-2.5 text-[#1a1a1a] text-sm focus:outline-none input-focus-effect transition-all duration-200 placeholder:text-[#d1d5db]"
                  />
                </div>

              </div>

              {/* Submit */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isPersonalLoading}
                  className="btn-primary bg-[#1a1a1a] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-2 cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPersonalLoading && <Spinner />}
                  {isPersonalLoading ? 'Đang lưu...' : 'Lưu Thông Tin'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ---- Login Information ---- */}
        <div className="animate-fade-in-up animate-delay-2 mt-8">
          <div className="bg-white rounded-none border border-[#e5e7eb] p-6 sm:p-8 md:p-10 card-hover">
            <h2 className="text-xl sm:text-2xl font-medium text-[#1a1a1a] mb-6 pb-4 border-b border-[#e5e7eb]">
              Thông Tin Đăng Nhập
            </h2>

            <div className="space-y-8">

              {/* Email */}
              <div className="space-y-3">
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
                  Địa Chỉ Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={user?.email ?? ''}
                  readOnly
                  className="w-full bg-[#f9fafb] border border-[#d1d5db] px-4 py-2.5 text-[#1a1a1a] text-sm opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-[#9ca3af]">
                  Để thay đổi email, vui lòng liên hệ bộ phận hỗ trợ.
                </p>
              </div>

              {/* Password Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
                    Mật Khẩu
                  </label>
                  {!showPasswordFields && (
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields(true)}
                      className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a] hover:text-[#444] transition-colors cursor-pointer"
                    >
                      Đổi Mật Khẩu
                    </button>
                  )}
                </div>

                {/* Hiển thị ẩn khi chưa chỉnh sửa */}
                {!showPasswordFields && (
                  <div className="w-full bg-[#f9fafb] border border-[#d1d5db] px-4 py-2.5 text-[#1a1a1a] text-sm opacity-60">
                    ••••••••••
                  </div>
                )}

                {/* Form đổi mật khẩu */}
                {showPasswordFields && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-fade-in-up">

                    <PasswordInput
                      id="currentPassword"
                      name="currentPassword"
                      placeholder="Mật khẩu hiện tại"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />

                    <PasswordInput
                      id="newPassword"
                      name="newPassword"
                      placeholder="Mật khẩu mới (tối thiểu 6 ký tự, 1 chữ hoa, 1 số, 1 ký tự đặc biệt)"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />

                    <PasswordInput
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Xác nhận mật khẩu mới"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isPasswordLoading}
                        className="btn-primary bg-[#1a1a1a] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3 hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-2 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isPasswordLoading && <Spinner />}
                        {isPasswordLoading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordFields(false);
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        }}
                        className="btn-secondary border border-[#d1d5db] text-[#1a1a1a] text-xs font-semibold uppercase tracking-widest px-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#e5e7eb] focus:ring-offset-2"
                      >
                        Huỷ
                      </button>
                    </div>

                  </form>
                )}

              </div>
            </div>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
};

export default Profile;
