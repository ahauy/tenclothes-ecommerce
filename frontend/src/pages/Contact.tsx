import React, { useState } from 'react';

const Contact = () => {
  const [formState, setFormState] = useState({ firstName: '', lastName: '', email: '', orderNumber: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Tin nhắn của bạn đã được gửi thành công.');
  };

  return (
    <div className="bg-[#f8f9ff] text-[#151c25] antialiased min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Noto+Serif:wght@400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        
        .font-serif { font-family: 'Noto Serif', serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      <main className="w-full font-sans max-w-[1440px] mx-auto px-[40px] py-[64px] md:py-[96px]">
        {/* Header Section */}
        <div className="mb-[64px]">
          <span className="text-[14px] leading-[1.4] font-semibold text-[#7e7576] uppercase tracking-[0.05em] block mb-[8px]">Dịch Vụ Khách Hàng</span>
          <h1 className="font-serif text-[48px] md:text-[64px] leading-[1.1] text-[#000000] max-w-2xl">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-[16px] md:text-[18px] leading-[1.6] text-[#4c4546] max-w-xl mt-[16px]">
            Cho dù bạn có câu hỏi về các bộ sưu tập, cần hỗ trợ về đơn hàng, hay đơn giản chỉ muốn chia sẻ suy nghĩ của mình, chúng tôi luôn ở đây để lắng nghe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[64px]">
          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#ffffff] border border-[#cfc4c5]/30 p-[32px] md:p-[48px]">
              <form onSubmit={handleSubmit} className="space-y-[24px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                  <div className="space-y-[8px]">
                    <label htmlFor="firstName" className="block text-[14px] font-medium text-[#151c25]">Tên *</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName"
                      value={formState.firstName}
                      onChange={handleChange}
                      required
                      className="w-full h-12 px-4 border border-[#cfc4c5] bg-[#ffffff] focus:outline-none focus:border-[#151c25] focus:ring-1 focus:ring-[#151c25] transition-colors"
                    />
                  </div>
                  <div className="space-y-[8px]">
                    <label htmlFor="lastName" className="block text-[14px] font-medium text-[#151c25]">Họ *</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName"
                      value={formState.lastName}
                      onChange={handleChange}
                      required
                      className="w-full h-12 px-4 border border-[#cfc4c5] bg-[#ffffff] focus:outline-none focus:border-[#151c25] focus:ring-1 focus:ring-[#151c25] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-[8px]">
                  <label htmlFor="email" className="block text-[14px] font-medium text-[#151c25]">Địa Chỉ Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 border border-[#cfc4c5] bg-[#ffffff] focus:outline-none focus:border-[#151c25] focus:ring-1 focus:ring-[#151c25] transition-colors"
                  />
                </div>

                <div className="space-y-[8px]">
                  <label htmlFor="orderNumber" className="block text-[14px] font-medium text-[#151c25]">Mã Đơn Hàng (Không bắt buộc)</label>
                  <input 
                    type="text" 
                    id="orderNumber" 
                    name="orderNumber"
                    value={formState.orderNumber}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-[#cfc4c5] bg-[#ffffff] focus:outline-none focus:border-[#151c25] focus:ring-1 focus:ring-[#151c25] transition-colors"
                  />
                </div>

                <div className="space-y-[8px]">
                  <label htmlFor="message" className="block text-[14px] font-medium text-[#151c25]">Tin Nhắn Của Bạn *</label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full p-4 border border-[#cfc4c5] bg-[#ffffff] focus:outline-none focus:border-[#151c25] focus:ring-1 focus:ring-[#151c25] transition-colors resize-y"
                  ></textarea>
                </div>

                <button type="submit" className="h-12 px-8 bg-[#151c25] text-[#ffffff] text-[14px] font-semibold tracking-[0.05em] uppercase hover:bg-[#4c4546] transition-colors duration-300 w-full md:w-auto">
                  GỬI TIN NHẮN
                </button>
              </form>
            </div>
          </div>

          {/* Contact Details Sidebar */}
          <div className="lg:col-span-5 space-y-[40px]">
            {/* Customer Care */}
            <div>
              <div className="flex items-center space-x-[12px] mb-[16px]">
                <span className="material-symbols-outlined text-[#7e7576]">support_agent</span>
                <h3 className="font-serif text-[24px] leading-[1.3] text-[#000000]">Chăm Sóc Khách Hàng</h3>
              </div>
              <p className="text-[16px] leading-[1.6] text-[#4c4546] mb-[8px]">
                Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ từ Thứ Hai đến Thứ Sáu, 9:00 Sáng - 6:00 Chiều.
              </p>
              <div className="space-y-[4px]">
                <a href="mailto:care@tenclothes.com" className="block text-[16px] leading-[1.6] text-[#151c25] font-medium hover:text-[#7e7576] transition-colors">care@tenclothes.com</a>
                <a href="tel:+390212345678" className="block text-[16px] leading-[1.6] text-[#151c25] font-medium hover:text-[#7e7576] transition-colors">+84 (0) 28 3812 3456</a>
              </div>
            </div>

            <div className="h-[1px] w-full bg-[#cfc4c5]/30"></div>

            {/* Studio / HQ */}
            <div>
              <div className="flex items-center space-x-[12px] mb-[16px]">
                <span className="material-symbols-outlined text-[#7e7576]">location_on</span>
                <h3 className="font-serif text-[24px] leading-[1.3] text-[#000000]">Trụ Sở Chính</h3>
              </div>
              <address className="text-[16px] leading-[1.6] text-[#4c4546] not-italic">
                TENCLOTHES HQ<br />
                Quận Hoàn Kiếm<br />
                Hà Nội, Việt Nam
              </address>
              <a href="#" className="inline-flex items-center space-x-[8px] mt-[12px] text-[14px] font-semibold tracking-[0.05em] uppercase text-[#151c25] hover:text-[#7e7576] transition-colors group">
                <span>Xem trên bản đồ</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>

            <div className="h-[1px] w-full bg-[#cfc4c5]/30"></div>

            {/* Press & Wholesale */}
            <div>
              <h3 className="font-serif text-[24px] leading-[1.3] text-[#000000] mb-[16px]">Yêu Cầu Khác</h3>
              <div className="space-y-[16px]">
                <div>
                  <span className="text-[14px] font-medium text-[#7e7576] block mb-[4px]">Báo Chí & Truyền Thông</span>
                  <a href="mailto:press@tenclothes.com" className="text-[16px] text-[#151c25] hover:text-[#7e7576] transition-colors">press@tenclothes.com</a>
                </div>
                <div>
                  <span className="text-[14px] font-medium text-[#7e7576] block mb-[4px]">Bán Buôn / Đại Lý</span>
                  <a href="mailto:wholesale@tenclothes.com" className="text-[16px] text-[#151c25] hover:text-[#7e7576] transition-colors">wholesale@tenclothes.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;