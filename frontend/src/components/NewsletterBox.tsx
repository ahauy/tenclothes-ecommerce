import { useState } from "react";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="my-16 sm:my-24">
      <div className="rounded-2xl bg-[#0f0f0f] px-8 sm:px-16 py-14 sm:py-16 flex flex-col sm:flex-row items-center gap-10 sm:gap-16">
        {/* Left copy */}
        <div className="flex-1 text-left">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-white/30 uppercase mb-4">
            Bản tin thời trang
          </p>
          <h2 className="prata-regular text-3xl sm:text-4xl text-white leading-snug mb-4">
            Ưu đãi dành riêng<br />
            <span className="italic text-white/50">cho thành viên</span>
          </h2>
          <p className="text-sm text-white/40 leading-relaxed max-w-xs">
            Đăng ký ngay để nhận ngay <span className="text-white font-semibold">20% giảm giá</span> cho đơn đầu tiên
            và cập nhật bộ sưu tập mới nhất.
          </p>
        </div>

        {/* Right: form */}
        <div className="w-full sm:w-auto sm:min-w-[360px]">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-semibold text-lg">Cảm ơn bạn!</p>
              <p className="text-white/40 text-sm text-center">
                Chúng tôi sẽ gửi mã giảm giá đến <span className="text-white/70">{email}</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập địa chỉ email của bạn"
                required
                className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm outline-none focus:border-white/30 transition-colors"
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-neutral-100 active:scale-[0.99] transition-all duration-200"
              >
                Đăng ký nhận ưu đãi
              </button>
              <p className="text-[11px] text-white/25 text-center leading-relaxed">
                Không spam. Hủy đăng ký bất cứ lúc nào.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterBox;