import React from "react";

export interface ICoupon {
  _id: string;
  code: string;
  description: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  minOrderAmount: number;
  expiresAt: string;
  isActive: boolean;
}

interface CouponListProps {
  coupons: ICoupon[];
  cartTotal: number;
  onSelect: (code: string) => void;
  isLoading: boolean;
  appliedCoupon: string | null;
}

const CouponList: React.FC<CouponListProps> = ({ coupons, cartTotal, onSelect, isLoading, appliedCoupon }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-neutral-50 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (coupons.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400">
          Vouchers
        </p>
        <span className="text-[10px] text-neutral-300 font-medium">Chọn mã để áp dụng</span>
      </div>
      
      {/* Scrollable Container with substantial max-height */}
      <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-2 pb-2 custom-scrollbar" style={{ scrollbarWidth: "thin" }}>
        {coupons.map((coupon) => {
          const isEligible = cartTotal >= coupon.minOrderAmount;
          const isApplied = appliedCoupon === coupon.code;
          const diff = coupon.minOrderAmount - cartTotal;

          return (
            <div
              key={coupon._id}
              onClick={() => isEligible && onSelect(coupon.code)}
              className={`group relative flex items-stretch min-h-[100px] flex-shrink-0 bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${
                isApplied 
                  ? "border-emerald-500 ring-1 ring-emerald-500 shadow-lg shadow-emerald-50/50" 
                  : isEligible
                    ? "border-neutral-200 hover:border-black cursor-pointer shadow-sm hover:shadow-md"
                    : "border-neutral-100 opacity-60 cursor-not-allowed"
              }`}
            >
              {/* Left Side: Ticket Stub */}
              <div className={`flex flex-col items-center justify-center w-24 flex-shrink-0 border-r border-dashed transition-colors duration-300 ${
                isApplied 
                  ? "bg-emerald-500 text-white" 
                  : isEligible 
                    ? "bg-black text-white" 
                    : "bg-neutral-100 text-neutral-400"
              }`}>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                  {coupon.discountType === "percentage" ? "Giảm" : "VND"}
                </span>
                <span className="text-xl font-black leading-none mt-1.5">
                  {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `${(coupon.discountValue / 1000)}k`}
                </span>
                
                {/* Applied Indicator Icon */}
                {isApplied && (
                  <div className="mt-2 bg-white text-emerald-500 rounded-full p-0.5 animate-in zoom-in-50 duration-300">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Right Side: Content Area */}
              <div className="flex-1 px-5 py-4 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`text-sm font-black tracking-tight ${isApplied ? "text-emerald-600" : isEligible ? "text-black" : "text-neutral-500"}`}>
                      {coupon.code}
                    </span>
                    {isApplied ? (
                      <span className="text-[9px] font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        Đang dùng
                      </span>
                    ) : !isEligible && (
                      <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-red-100">
                        Thiếu {diff.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                    {coupon.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                   <p className="text-[10px] text-neutral-400 font-medium">
                    Hạn dùng: {new Date(coupon.expiresAt).toLocaleDateString("vi-VN")}
                  </p>
                  {isEligible && !isApplied && (
                    <span className="text-[10px] font-bold text-black opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      Áp dụng ngay →
                    </span>
                  )}
                </div>
              </div>

              {/* Ticket Decorative Holes (Inner side notches) */}
              <div className="absolute top-1/2 left-[90px] -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-neutral-100 -ml-2 z-10 hidden sm:block" />
              
              {/* Corner Punches */}
              <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-neutral-50 rounded-full border-r border-neutral-200" />
              <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-neutral-50 rounded-full border-l border-neutral-200" />
              
              {/* Overlay for Ineligible state */}
              {!isEligible && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[0.5px] opacity-0 hover:opacity-100 transition-opacity p-4 text-center cursor-not-allowed">
                   <p className="text-[11px] font-bold text-black bg-white px-4 py-2 rounded-xl shadow-xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
                    Mua thêm {(diff).toLocaleString("vi-VN")}đ để dùng mã này
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CouponList;
