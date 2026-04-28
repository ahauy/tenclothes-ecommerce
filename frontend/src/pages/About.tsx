import React from 'react';

const About = () => {
  return (
    <div className="bg-[#f8f9ff] text-[#151c25] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Noto+Serif:wght@400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        
        .font-serif { font-family: 'Noto Serif', serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        /* Định nghĩa Animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
        }
        .animate-delay-1 { animation-delay: 0.2s; opacity: 0; }
        .animate-delay-2 { animation-delay: 0.4s; opacity: 0; }
        .animate-delay-3 { animation-delay: 0.6s; opacity: 0; }
      `}</style>
      
      <main className="w-full font-sans">
        {/* Hero Section */}
        <section className="w-full h-[600px] md:h-[819px] relative flex items-center justify-center overflow-hidden animate-fade-in-up">
          <div className="absolute inset-0 w-full h-full">
            <img 
              alt="Hero Background" 
              className="w-full h-full object-cover object-center opacity-90" 
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070"
            />
            <div className="absolute inset-0 bg-[#ffffff]/30 backdrop-blur-[2px]"></div>
          </div>
          <div className="relative z-10 max-w-[1440px] mx-auto px-[40px] text-center flex flex-col items-center">
            <span className="text-[14px] leading-[1.4] font-semibold text-[#151c25] uppercase tracking-[0.05em] block mb-[16px]">Về Chúng Tôi</span>
            <h1 className="font-serif text-[48px] md:text-[64px] leading-[1.1] text-[#000000] mb-[24px] max-w-4xl tracking-tight">
              Nghệ Thuật Chế Tác Tinh Tế
            </h1>
            <p className="text-[16px] md:text-[18px] leading-[1.6] text-[#4c4546] max-w-2xl font-medium">
              Nơi thiết kế vượt thời gian giao thoa cùng chất lượng không thỏa hiệp. Chúng tôi tạo ra những trang phục bền bỉ, được chế tác bằng tâm huyết và sự tôn trọng tuyệt đối dành cho môi trường.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-[64px] my-[64px] max-w-[1440px] mx-auto px-[40px] animate-fade-in-up animate-delay-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px] items-center">
            <div className="col-span-1 md:col-span-5 md:col-start-2 flex flex-col justify-center space-y-[24px]">
              <span className="text-[14px] leading-[1.4] font-semibold text-[#7e7576] uppercase tracking-[0.05em]">Khởi Nguồn</span>
              <h2 className="font-serif text-[32px] md:text-[40px] leading-[1.2] text-[#000000]">
                Bắt đầu từ khao khát về sự tối giản trong một thế giới phức tạp.
              </h2>
              <p className="text-[16px] leading-[1.6] text-[#4c4546]">
                TENCLOTHES ra đời như một sự phản kháng thầm lặng chống lại tính chất phù du của thời trang hiện đại. Chúng tôi mong muốn xây dựng một tủ quần áo dựa trên nền tảng vững chắc, thay vì chạy theo xu hướng nhất thời. 
              </p>
              <p className="text-[16px] leading-[1.6] text-[#4c4546]">
                Mỗi sản phẩm là một quá trình tinh giản — loại bỏ những thứ không cần thiết để tôn vinh phom dáng, công năng và chất liệu chân thực nhất.
              </p>
              <div className="pt-[8px]">
                <button className="h-12 px-8 border border-[#7e7576] text-[#000000] text-[14px] font-semibold tracking-[0.05em] uppercase hover:bg-[#151c25] hover:text-white transition-colors duration-300">
                  ĐỌC TUYÊN NGÔN CỦA CHÚNG TÔI
                </button>
              </div>
            </div>
            <div className="col-span-1 md:col-span-5 md:col-start-8 mt-[24px] md:mt-0">
              <div className="aspect-[3/4] w-full relative group overflow-hidden border border-[#cfc4c5]/30">
                <img 
                  alt="Chi tiết xưởng may" 
                  className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105" 
                  src="https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?auto=format&fit=crop&q=80&w=2070"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values - Bento Grid (Đã bổ sung đầy đủ) */}
        <section className="py-[64px] bg-[#f8f9ff] px-[40px] animate-fade-in-up animate-delay-2">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-[64px]">
              <span className="text-[14px] leading-[1.4] font-semibold text-[#7e7576] uppercase tracking-[0.05em] block mb-[4px]">Triết Lý</span>
              <h2 className="font-serif text-[32px] md:text-[40px] leading-[1.2] text-[#000000]">Bền Vững & Giá Trị</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] auto-rows-[400px]">
              {/* Card 1 */}
              <div className="col-span-1 md:col-span-2 relative overflow-hidden group border border-[#cfc4c5]/30 bg-[#ffffff] p-8 flex flex-col justify-end">
                <img 
                  alt="Chất liệu minh bạch" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                  src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80&w=2070"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#ffffff] via-[#ffffff]/70 to-transparent"></div>
                <div className="relative z-10 max-w-md">
                  <h3 className="font-serif text-[24px] md:text-[32px] leading-[1.3] text-[#000000] mb-[8px]">Chất Liệu Minh Bạch</h3>
                  <p className="text-[16px] leading-[1.6] text-[#4c4546] font-medium">Chúng tôi chỉ sử dụng các loại sợi hữu cơ, tái chế hoặc tái sinh có nguồn gốc rõ ràng nhằm giảm thiểu tác động đến môi trường.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="col-span-1 border border-[#cfc4c5]/30 bg-[#ffffff] p-8 flex flex-col justify-center space-y-[12px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-shadow duration-300">
                <span className="material-symbols-outlined text-5xl text-[#7e7576] font-light mb-[4px]">recycling</span>
                <h3 className="font-serif text-[24px] md:text-[32px] leading-[1.3] text-[#000000]">Thiết Kế Tuần Hoàn</h3>
                <p className="text-[16px] leading-[1.6] text-[#4c4546]">Trang phục được thiết kế không chỉ cho cuộc sống hiện tại mà còn hướng tới vòng đời tái chế trong tương lai.</p>
              </div>

              {/* Card 3 (Bổ sung thêm) */}
              <div className="col-span-1 border border-[#cfc4c5]/30 bg-[#ffffff] p-8 flex flex-col justify-center space-y-[12px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-shadow duration-300">
                <span className="material-symbols-outlined text-5xl text-[#7e7576] font-light mb-[4px]">handshake</span>
                <h3 className="font-serif text-[24px] md:text-[32px] leading-[1.3] text-[#000000]">Đạo Đức Lao Động</h3>
                <p className="text-[16px] leading-[1.6] text-[#4c4546]">Chúng tôi hợp tác độc quyền với các nhà máy đảm bảo môi trường làm việc an toàn, công bằng và tôn trọng người lao động.</p>
              </div>

              {/* Card 4 (Bổ sung thêm) */}
              <div className="col-span-1 md:col-span-2 relative overflow-hidden group border border-[#cfc4c5]/30 bg-[#ffffff] p-8 flex flex-col justify-end">
                <img 
                  alt="Dấu chân Carbon" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2074"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#ffffff] via-[#ffffff]/70 to-transparent"></div>
                <div className="relative z-10 max-w-md">
                  <h3 className="font-serif text-[24px] md:text-[32px] leading-[1.3] text-[#000000] mb-[8px]">Dấu Chân Carbon Bằng 0</h3>
                  <p className="text-[16px] leading-[1.6] text-[#4c4546] font-medium">Từ khâu vận chuyển đến bao bì, chúng tôi không ngừng tối ưu hóa quy trình để hướng tới mục tiêu phát thải ròng bằng 0.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section (Bổ sung phần kết) */}
        <section className="py-[96px] bg-[#151c25] text-[#ffffff] px-[40px] text-center animate-fade-in-up animate-delay-3">
          <div className="max-w-[800px] mx-auto space-y-[32px]">
            <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.2]">
              Cùng Chúng Tôi Thay Đổi Cách Bạn Ăn Mặc
            </h2>
            <p className="text-[16px] md:text-[18px] leading-[1.6] text-[#cfc4c5] font-light">
              Khám phá bộ sưu tập mới nhất và trải nghiệm sự khác biệt từ những thiết kế được tạo ra bằng cả tâm huyết.
            </p>
            <div className="pt-[16px] flex flex-col sm:flex-row items-center justify-center gap-[16px]">
              <button className="h-12 px-8 bg-[#ffffff] text-[#151c25] text-[14px] font-semibold tracking-[0.05em] uppercase hover:bg-[#eef4ff] transition-colors duration-300 w-full sm:w-auto">
                MUA SẮM NGAY
              </button>
              <button className="h-12 px-8 border border-[#cfc4c5] text-[#ffffff] text-[14px] font-semibold tracking-[0.05em] uppercase hover:bg-[#ffffff] hover:text-[#151c25] transition-colors duration-300 w-full sm:w-auto">
                TÌM HIỂU THÊM
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;