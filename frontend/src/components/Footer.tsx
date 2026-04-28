import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const LINKS = {
  company: [
    { label: "Trang chủ", to: "/" },
    { label: "Giới thiệu", to: "/about" },
    { label: "Bộ sưu tập", to: "/collection/all" },
    { label: "Chính sách đổi trả", to: "/about" },
  ],
  support: [
    { label: "Liên hệ", to: "/contact" },
    { label: "Lịch sử đơn hàng", to: "/account/orders" },
    { label: "Chính sách bảo mật", to: "/" },
  ],
};

const SOCIALS = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
    ),
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-neutral-100 pt-14 pb-8 mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
        {/* Brand column */}
        <div>
          <Link to="/">
            <img src={assets.logo} alt="TenClothes" className="w-28 mb-5" />
          </Link>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-[220px]">
            Thời trang cao cấp với phong cách tinh tế — dành cho những ai
            trân trọng chất lượng và sự khác biệt.
          </p>
          {/* Socials */}
          <div className="flex gap-3 mt-6">
            {SOCIALS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:border-black hover:text-black transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Company links */}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-black/40 mb-5">
            Công ty
          </p>
          <ul className="flex flex-col gap-3">
            {LINKS.company.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm text-neutral-500 hover:text-black transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support links */}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-black/40 mb-5">
            Hỗ trợ
          </p>
          <ul className="flex flex-col gap-3">
            {LINKS.support.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm text-neutral-500 hover:text-black transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-black/40 mb-5">
            Liên hệ
          </p>
          <ul className="flex flex-col gap-3">
            <li>
              <a href="tel:+84755684080" className="text-sm text-neutral-500 hover:text-black transition-colors">
                +84 755 684 080
              </a>
            </li>
            <li>
              <a href="mailto:hello@tenclothes.vn" className="text-sm text-neutral-500 hover:text-black transition-colors">
                hello@tenclothes.vn
              </a>
            </li>
            <li className="text-sm text-neutral-400">
              Hà Nội, Việt Nam
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-neutral-100">
        <p className="text-xs text-neutral-400">
          © 2026 TenClothes. Bảo lưu mọi quyền.
        </p>
        <div className="flex items-center gap-2">
          {["VISA", "MC", "MoMo", "COD"].map((method) => (
            <span
              key={method}
              className="text-[10px] font-semibold px-2.5 py-1 border border-neutral-200 rounded text-neutral-400"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
