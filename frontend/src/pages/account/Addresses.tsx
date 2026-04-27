import React from 'react';

const Addresses: React.FC = () => {
  // TODO: Fetch addresses from backend API
  const addresses = [
    {
      id: 1,
      name: 'Vũ Tuấn Hậu',
      phone: '(+84) 987654321',
      addressLine: 'Số 123 Đường Nguyễn Văn Linh, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Vũ Tuấn Hậu (Văn phòng)',
      phone: '(+84) 912345678',
      addressLine: 'Tòa nhà Bitexco, Số 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      isDefault: false,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-noto-serif mb-2 text-white">Địa chỉ của tôi</h1>
          <p className="text-neutral-400 font-manrope">Quản lý sổ địa chỉ giao hàng.</p>
        </div>
        <button className="bg-white text-black font-bold uppercase tracking-widest px-6 py-3 hover:bg-neutral-200 transition-colors duration-300 text-sm">
          + THÊM ĐỊA CHỈ MỚI
        </button>
      </div>

      <div className="flex flex-col gap-4 font-manrope">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white dark:bg-neutral-900 border border-neutral-800 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg text-white font-semibold">{address.name}</span>
                {address.isDefault && (
                  <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs px-2 py-1 uppercase tracking-wider font-bold">
                    Mặc định
                  </span>
                )}
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-1 text-sm">{address.phone}</p>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">{address.addressLine}</p>
            </div>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <button className="text-sm font-bold text-white hover:text-neutral-500 transition-colors underline decoration-1 underline-offset-4">
                Cập nhật
              </button>
              {!address.isDefault && (
                <button className="text-sm font-bold text-neutral-500 hover:text-red-600 transition-colors underline decoration-1 underline-offset-4">
                  Xóa
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;
