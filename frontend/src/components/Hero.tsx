import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row min-h-[72vh] sm:min-h-[80vh] overflow-hidden rounded-2xl mt-6">

      {/* ── Left: Text Panel ── */}
      <div className="w-full sm:w-1/2 flex items-center justify-center bg-[#f7f5f2] px-10 py-16 sm:py-0">
        <div className="max-w-md">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-10 h-px bg-black/40" />
            <span className="text-[11px] font-semibold tracking-[0.22em] text-black/50 uppercase">
              Bộ sưu tập mới nhất
            </span>
          </div>

          {/* Headline */}
          <h1 className="prata-regular text-4xl sm:text-5xl lg:text-6xl leading-tight text-black mb-6">
            Phong cách<br />
            <span className="italic text-neutral-500">tinh tế</span> của bạn
          </h1>

          {/* Sub copy */}
          <p className="text-sm sm:text-base text-neutral-500 leading-relaxed mb-10 max-w-xs">
            Khám phá những thiết kế được chọn lọc kỹ lưỡng — nơi chất liệu cao cấp
            gặp gỡ phong cách sống hiện đại.
          </p>

          {/* CTA */}
          <div className="flex items-center gap-5">
            <Link
              to="/collection/all"
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200"
            >
              Mua sắm ngay
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-black/60 hover:text-black underline-offset-4 hover:underline transition-colors"
            >
              Về chúng tôi
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 mt-14 pt-8 border-t border-black/10">
            {[
              { num: "500+", label: "Sản phẩm" },
              { num: "10K+", label: "Khách hàng" },
              { num: "4.9★", label: "Đánh giá" },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="text-xl font-bold text-black">{num}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Image ── */}
      <div className="w-full sm:w-1/2 relative overflow-hidden" style={{ minHeight: "380px" }}>
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={assets.hero_img}
          alt="Hero"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f7f5f2]/30 to-transparent pointer-events-none" />

        {/* Floating badge */}
        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-xl px-5 py-3 shadow-lg">
          <p className="text-[10px] font-semibold tracking-widest text-black/40 uppercase mb-0.5">Giảm giá</p>
          <p className="text-xl font-bold text-black">Đến 40%</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;