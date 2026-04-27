import React from 'react';

const Orders: React.FC = () => {
  // TODO: Fetch orders from backend API
  const orders = [
    {
      id: '71168335965',
      date: '25/08/2025',
      status: 'Cancelled',
      statusClass: 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200',
      total: '₫999.000',
      shipping: '₫0',
      items: [
        {
          id: 1,
          name: 'Pack 3 Áo ba lỗ 100% Cotton',
          size: 'M',
          quantity: 1,
          price: '₫299.000',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6SgkM9-qjiboPXs6kf4anAmpQK3_Mqhm9trji5-bG7tTIA-DNdVHNVaw_ho6h_O2wHq9S2HfFOrIDujNmxZ37qXk5ByVnBMq-VV1VPbcEl0C62NNYzSkjo_QaZWfnaFCMz2juKjLmmUwKV5xeEb6LVXOJdDESPgOYasXIz3G5Cn4qzsbtJ7rDpq16js3c_MEUmghhLY2lgbwtp_PDL8QBXFMPwaeQoxwgqRnLLYpn_TeaolhoLgAVqQ2GpHq20tcw84C9LgP-aT07'
        },
        {
          id: 2,
          name: 'Quần Thể Thao Nam 7" Ultra Shorts',
          size: 'L',
          quantity: 2,
          price: '₫350.000',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY7AHpXOlMZZsrpqV8ig3BfZlQ96yRzveCsZufvGZ_V_imqolMm-9WUXDl_aVcfQC_soCZQ62qjYIBXt-fhRROM8eZJc6M-2fSDfMjck0FqiKk91F5HHpAlFu615WMMRFplkm9NKgVH4su1jih0ep5sbxsrkX15WCm1qFrG0orIOgexYTN25EmToGH5UB_XnHnXrf9aGtFPq69oz5q_ncDrcCJqC95QRwS91WjJ8l2hQNKxAc819D2pjX3p1LEZX4REvAnkEAYcuQt'
        }
      ]
    },
    {
      id: '62884199022',
      date: '10/08/2025',
      status: 'Delivered',
      statusClass: 'bg-black text-white dark:bg-white dark:text-black',
      total: '₫450.000',
      shipping: '₫0',
      items: [
        {
          id: 3,
          name: 'Essential Supima T-Shirt',
          size: 'M',
          quantity: 1,
          price: '₫450.000',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyyjAisHB_UL9oq6gCXeinHpxvjulQc4I21kTkkchsPyXqkwFeYIfq5geIFwzvss3dPO2rZgxV85FmOrOSMTwEoWOskvx9LoiPYQsK444H9dOopZUml7blKU2XUTTb84ZLZstOUrfIlEdR-CRFsbYXwm_EMH5cY46edpkgIviHh0sovqkeuLHSFoNvbotEaG7EsdyD1PbT48b57xJl7AiAjq0_bMKv-R1rRijVXcV_FCCmAkPDrmsvfktUbmUMx3zcVZq2IHW8Xx_l'
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex justify-between items-end border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-noto-serif mb-2 text-white">Lịch sử đơn hàng</h1>
          <p className="text-neutral-400 font-manrope">Xem lại các đơn hàng đã mua và trạng thái đơn hàng hiện tại.</p>
        </div>
      </div>

      <div className="space-y-8 font-manrope">
        {orders.map((order) => (
          <article
            key={order.id}
            className={`bg-white dark:bg-neutral-900 border border-neutral-800 p-6 flex flex-col md:flex-row gap-6 ${
              order.status === 'Cancelled' ? 'opacity-80 grayscale-[30%]' : ''
            }`}
          >
            <div className="flex-1 border-b md:border-b-0 md:border-r border-neutral-800 pb-6 md:pb-0 md:pr-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-bold text-neutral-500 uppercase mb-1 tracking-wider">Đơn hàng #{order.id}</p>
                  <p className="text-sm text-white">Đặt ngày {order.date}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider ${order.statusClass}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-20 h-24 bg-neutral-100 dark:bg-neutral-800 shrink-0 relative overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">{item.name}</h3>
                      <p className="text-sm text-neutral-500 mt-1">
                        Size: {item.size} | SL: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white font-medium">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:w-64 flex flex-col justify-between shrink-0">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Tạm tính</span>
                  <span>{order.total}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Phí giao hàng</span>
                  <span>{order.shipping}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-4 border-t border-neutral-800 mt-4">
                  <span>Tổng cộng</span>
                  <span>{order.total}</span>
                </div>
              </div>
              
              <button
                className={`w-full py-3 px-4 font-bold uppercase tracking-widest text-sm transition-colors ${
                  order.status === 'Cancelled'
                    ? 'border border-neutral-300 dark:border-neutral-700 text-white hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {order.status === 'Cancelled' ? 'Xem chi tiết' : 'Mua lại'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Orders;
