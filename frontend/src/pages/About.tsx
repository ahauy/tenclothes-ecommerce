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
      `}</style>
      
      <main className="w-full font-sans">
        {/* Hero Section */}
        <section className="w-full h-[600px] md:h-[819px] relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img 
              alt="Hero Background" 
              className="w-full h-full object-cover object-center opacity-90" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcEU8mFDb4vEuWIUTX1picIRdS4DbqJX8JKuLMq5f2W1uWg8yJv0qpLBs9Y5RfCWlhRyRd4bW0x2sxBcspyWIor-QIaddCorLf2xVRoGJ6o7IUEGa_6puwm1CeArH72FARxWydwrtEJydE5drB38Svdb1hg7WHb4zmxG9i_Vojo49JxgiKTjg6-oqyTlKXwR2d1AaJwZbTDJJ8l4iKncfdIBHXu_mMrB8lQGD-gCun2qfnmdx_4i0-pS4zpUxYeWpXTZAE1wkUZRG_"
            />
            <div className="absolute inset-0 bg-[#ffffff]/30 backdrop-blur-[2px]"></div>
          </div>
          <div className="relative z-10 max-w-[1440px] mx-auto px-[40px] text-center flex flex-col items-center">
            <h1 className="font-serif text-[48px] md:text-[64px] leading-[1.1] text-[#000000] mb-[24px] max-w-4xl tracking-tight">
              Nghệ Thuật Chế Tác Tinh Tế
            </h1>
            <p className="text-[16px] md:text-[18px] leading-[1.6] text-[#4c4546] max-w-2xl font-light">
              Nơi thiết kế vượt thời gian giao thoa cùng chất lượng không thỏa hiệp. Chúng tôi tạo ra những trang phục bền bỉ, được chế tác bằng tâm huyết và sự tôn trọng tuyệt đối dành cho môi trường.
            </p>
          </div>
        </section>

        {/* Our Story - Asymmetric Layout */}
        <section className="py-[64px] my-[64px] max-w-[1440px] mx-auto px-[40px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px] items-center">
            <div className="col-span-1 md:col-span-5 md:col-start-2 flex flex-col justify-center space-y-[24px]">
              <span className="text-[14px] leading-[1.4] font-semibold text-[#7e7576] uppercase tracking-[0.05em]">Khởi Nguồn</span>
              <h2 className="font-serif text-[32px] md:text-[40px] leading-[1.2] text-[#000000]">
                Bắt đầu từ khao khát về sự tối giản trong một thế giới phức tạp.
              </h2>
              <p className="text-[16px] leading-[1.6] text-[#4c4546]">
                TENCLOTHES ra đời như một sự phản kháng thầm lặng chống lại tính chất phù du của thời trang hiện đại. Chúng tôi mong muốn xây dựng một tủ quần áo dựa trên nền tảng vững chắc, thay vì chạy theo xu hướng nhất thời. Mỗi sản phẩm là một quá trình tinh giản—loại bỏ những thứ không cần thiết để tôn vinh phom dáng và công năng.
              </p>
              <p className="text-[16px] leading-[1.6] text-[#4c4546]">
                Hành trình của chúng tôi bắt đầu trong một xưởng may nhỏ, với sự ám ảnh về độ rủ của một chiếc sơ mi lụa. Ngày nay, chính sự tỉ mỉ đến từng chi tiết đó định hình toàn bộ bộ sưu tập của chúng tôi. Chúng tôi không chỉ thiết kế quần áo; chúng tôi kiến tạo nên sự tự tin tĩnh lặng.
              </p>
              <div className="pt-[8px]">
                <button className="h-12 px-8 border border-[#7e7576] text-[#000000] text-[14px] font-semibold tracking-[0.05em] uppercase hover:bg-[#eef4ff] transition-colors duration-300">
                  ĐỌC TUYÊN NGÔN CỦA CHÚNG TÔI
                </button>
              </div>
            </div>
            <div className="col-span-1 md:col-span-5 md:col-start-8 mt-[24px] md:mt-0">
              <div className="aspect-[3/4] w-full relative group overflow-hidden">
                <img 
                  alt="Chi tiết xưởng may" 
                  className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnYdQnEqTW-PN_CToHmr2okT2HErHKKwHfZWeCPF2-PIYyV4S62nrJFa8eQnuyK50QHPrj8uKZEG2yy58fd8uQoHLMYlujvsQ1feDD4pcN2dfREUz705GtHB8P1mIsWnUiLXssQ6ardp5CCKFymZf7Xw75PSE0aL-7co0jTUN_vqNJHSA2VkJogmEaK4-mXyZrpgvzXj1fjyNmz5VgZQa_gYNrzi6gBslDKSXouekioAgN_IYzVPvY6q7foOtqmQsDltYA1mYFV1yr"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values - Bento Grid */}
        <section className="py-[64px] bg-[#f8f9ff] px-[40px]">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-[64px]">
              <span className="text-[14px] leading-[1.4] font-semibold text-[#7e7576] uppercase tracking-[0.05em] block mb-[4px]">Triết Lý</span>
              <h2 className="font-serif text-[32px] md:text-[40px] leading-[1.2] text-[#000000]">Bền Vững & Giá Trị</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] auto-rows-[400px]">
              {/* Value 1: Large Feature */}
              <div className="col-span-1 md:col-span-2 relative overflow-hidden group border border-[#cfc4c5]/30 bg-[#ffffff] p-8 flex flex-col justify-end">
                <img 
                  alt="Chất liệu" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNQ1_rSlYmu-k-fFdo1aN9oKDARxk44_rn10NuuvsVS9NCaKRhQGRKFlkTG5xjIN4-C9Zg_1_4lURg-gSe3MWj1V65JokK-65lfI16Z9Pzaw6RjpLgLGM-JuYWatRR7eAMkaeMZu1BI9l32VK3C8TsaDaT9ETU95YRm5QyjxlwTrtmnum_Rq-tD1WAdp2zKJ7UsCGgAx2uuvf1pAncejKuLLORqh5IGNXT6cCJmET14hkz-gpvOFNaP_MoMUOjirbtJn6Yz1Lrb3KW"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#ffffff] via-[#ffffff]/50 to-transparent"></div>
                <div className="relative z-10 max-w-md">
                  <h3 className="font-serif text-[24px] md:text-[32px] leading-[1.3] text-[#000000] mb-[4px]">Chất Liệu Minh Bạch</h3>
                  <p className="text-[16px] leading-[1.6] text-[#4c4546]">Chúng tôi chỉ sử dụng các loại sợi hữu cơ, tái chế hoặc tái sinh. Mỗi sợi chỉ đều có nguồn gốc rõ ràng, đảm bảo dấu chân sinh thái của chúng tôi luôn ở mức tối thiểu nhất.</p>
                </div>
              </div>

              {/* Value 2: Text Card */}
              <div className="col-span-1 border border-[#cfc4c5]/30 bg-[#ffffff] p-8 flex flex-col justify-center space-y-[8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-shadow duration-300">
                <span className="material-symbols-outlined text-4xl text-[#7e7576] font-light mb-[4px]">recycling</span>
                <h3 className="font-serif text-[24px] md:text-[32px] leading-[1.3] text-[#000000]">Thiết Kế Tuần Hoàn</h3>
                <p className="text-[16px] leading-[1.6] text-[#4c4546]">Trang phục được thiết kế không chỉ cho cuộc sống hiện tại, mà còn cho cả vòng đời của chúng. Chúng tôi cung cấp dịch vụ sửa chữa và chương trình thu hồi để hạn chế tối đa rác thải.</p>
              </div>

              {/* Value 3: Image Card */}
              <div className="col-span-1 relative overflow-hidden group border border-[#cfc4c5]/30">
                <img 
                  alt="Sự tinh xảo" 
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPh8i7SDF0R16ZEtByYd3KIXPth3ds4LccjGnYkSfEsaEmEj35KaimiXxHru3RxgtfA-I_H8l1rD7NXCiPsC9z2mBaCPuWxdvWdbnVYoOQ9hLUsjbcI_AW3Ts2zfltQB_vAxt3V22yTDkNmwKXZYGKg7EK2aRexab3L3_smTUAd3iHv2rq986arqjpK1Od2tPn7qRiQNP8N4QN0rVV6A9u7zBcKzn8JkbI3Jd2LQ_QubA2TfzTHy5dTsd1XnyUXjEPK-krPQnsWFO3"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-8 left-8 right-8 text-[#ffffff]">
                  <h3 className="font-serif text-[24px] md:text-[32px] leading-[1.3]">Sản Xuất Đạo Đức</h3>
                </div>
              </div>

              {/* Value 4: Wide Text Card */}
              <div className="col-span-1 md:col-span-2 border border-[#cfc4c5]/30 bg-[#ffffff] p-12 flex flex-col md:flex-row items-start md:items-center justify-between hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-shadow duration-300">
                <div className="max-w-lg mb-8 md:mb-0">
                  <span className="material-symbols-outlined text-4xl text-[#7e7576] font-light mb-[4px]">handshake</span>
                  <h3 className="font-serif text-[24px] md:text-[32px] leading-[1.3] text-[#000000] mb-[4px]">Đối Tác Công Bằng</h3>
                  <p className="text-[16px] leading-[1.6] text-[#4c4546]">Chúng tôi tự hào hợp tác với các xưởng may gia đình uy tín, nơi luôn cam kết mức lương công bằng, điều kiện làm việc an toàn và sự tôn trọng tuyệt đối dành cho các nghệ nhân.</p>
                </div>
                <button className="h-12 w-12 rounded-full border border-[#7e7576] flex items-center justify-center hover:bg-[#eef4ff] transition-colors duration-300">
                  <span className="material-symbols-outlined text-[#000000]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;