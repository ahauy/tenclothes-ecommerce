import React, { useState } from 'react';

const Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: 'Vũ',
    lastName: 'Tuấn Hậu',
    email: 'vutuanhau@example.com',
    phone: '0987654321',
    gender: 'male',
    dob: '1990-01-01',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend API
    console.log('Update Profile:', formData);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h1 className="text-3xl md:text-4xl font-noto-serif mb-2 text-white">Hồ sơ cá nhân</h1>
        <p className="text-neutral-400 font-manrope">Quản lý thông tin cá nhân và tùy chọn của bạn.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 font-manrope">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-bold uppercase tracking-wider text-white">
              Họ
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-[#141414] border border-neutral-800 px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-shadow"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-bold uppercase tracking-wider text-white">
              Tên
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-[#141414] border border-neutral-800 px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-shadow"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider text-white">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#141414] border border-neutral-800 px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-shadow opacity-70 cursor-not-allowed"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-bold uppercase tracking-wider text-white">
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-[#141414] border border-neutral-800 px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-shadow"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="gender" className="block text-sm font-bold uppercase tracking-wider text-white">
              Giới tính
            </label>
            <div className="relative">
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-[#141414] border border-neutral-800 px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-shadow appearance-none"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
                <option value="unspecified">Không chỉ định</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <span className="material-symbols-outlined text-neutral-500">expand_more</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="dob" className="block text-sm font-bold uppercase tracking-wider text-white">
              Ngày sinh
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full bg-[#141414] border border-neutral-800 px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-shadow"
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="bg-white text-black font-bold uppercase tracking-widest px-8 py-4 hover:bg-neutral-200 transition-colors duration-300"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
