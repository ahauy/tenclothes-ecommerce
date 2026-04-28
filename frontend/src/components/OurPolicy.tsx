const POLICIES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    title: "Đổi trả dễ dàng",
    desc: "Đổi trả miễn phí trong vòng 7 ngày kể từ ngày nhận hàng.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Bảo hành chất lượng",
    desc: "Cam kết 100% chính hãng — hoàn tiền nếu không như mô tả.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Giao hàng nhanh",
    desc: "Nội thành 2-4h, toàn quốc 1-3 ngày. Miễn phí vận chuyển đơn từ 500K.",
  },
];

const OurPolicy = () => {
  return (
    <section className="my-16 sm:my-24">
      {/* Section header */}
      <div className="text-center mb-12">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-black/40 uppercase mb-3">
          Cam kết của chúng tôi
        </p>
        <h2 className="prata-regular text-3xl sm:text-4xl text-black">
          Mua sắm an tâm
        </h2>
        <span className="block w-8 h-px bg-black/25 mt-4 mx-auto" />
      </div>

      {/* Policy cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {POLICIES.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-start gap-4 p-6 sm:p-7 rounded-2xl border border-neutral-100 bg-white hover:border-neutral-300 hover:shadow-sm transition-all duration-200 group"
          >
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-neutral-50 text-black group-hover:bg-black group-hover:text-white transition-colors duration-200">
              {icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-black mb-1.5">{title}</p>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurPolicy;
