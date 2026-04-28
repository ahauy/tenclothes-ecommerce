import ReactDOM from "react-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useShopStore } from "../stores/useShopStore";
import { useDebounce } from "../hooks/useDebounce";
import api from "../utils/axios";

export interface ISearchResult {
  _id: string;
  title: string;
  slug: string;
  price: number;
  salePrice: number;
  discountPercentage: number;
  productStyles: { images: string[]; colorName: string }[];
}

const TRENDING_TAGS = ["Áo sơ mi", "Quần tây", "Đầm dự tiệc", "Áo khoác", "Giày oxford"];

/* ─────────────── Skeleton ─────────────── */
const ResultSkeleton = () => (
  <div className="flex items-center gap-4 px-6 py-3 animate-pulse">
    <div className="w-14 h-16 rounded-lg bg-neutral-100 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-3/5 rounded bg-neutral-100" />
      <div className="h-3 w-2/5 rounded bg-neutral-100" />
    </div>
    <div className="h-4 w-16 rounded bg-neutral-100" />
  </div>
);

/* ─────────────── Main Component ─────────────── */
const Search = () => {
  const openModal = useShopStore((s) => s.openModal);
  const setOpenModal = useShopStore((s) => s.setOpenModal);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<ISearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedTerm = useDebounce(searchTerm, 380);

  /* Lock scroll & autofocus */
  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "";
      setSearchTerm("");
      setResults([]);
      setActiveIndex(-1);
    }
    return () => { document.body.style.overflow = ""; };
  }, [openModal]);

  /* Fetch results */
  useEffect(() => {
    if (!debouncedTerm.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products/search?keyword=${encodeURIComponent(debouncedTerm)}&limit=6`);
        if (!cancelled && res.data.status) setResults(res.data.data);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [debouncedTerm]);

  /* Keyboard navigation */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") { setOpenModal(false); return; }
      if (!results.length) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, -1)); }
      if (e.key === "Enter" && activeIndex >= 0) {
        setOpenModal(false);
        navigate(`/product/${results[activeIndex].slug}`);
      }
    },
    [results, activeIndex, navigate, setOpenModal]
  );

  const goToProduct = (slug: string) => {
    setOpenModal(false);
    navigate(`/product/${slug}`);
  };

  const goToCollection = () => {
    setOpenModal(false);
    navigate(`/collection/all?keyword=${encodeURIComponent(debouncedTerm)}`);
  };

  const setTag = (tag: string) => {
    setSearchTerm(tag);
    inputRef.current?.focus();
  };

  const isEmpty = !isLoading && debouncedTerm.trim() && results.length === 0;
  const hasResults = !isLoading && results.length > 0;
  const isIdle = !debouncedTerm.trim() && !isLoading;

  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <>
      {/* ─── Backdrop ─── */}
      <div
        onClick={() => setOpenModal(false)}
        className="fixed inset-0 z-[9998] transition-all duration-300"
        style={{
          backgroundColor: openModal ? "rgba(0,0,0,0.45)" : "transparent",
          backdropFilter: openModal ? "blur(6px)" : "none",
          pointerEvents: openModal ? "auto" : "none",
          opacity: openModal ? 1 : 0,
        }}
      />

      {/* ─── Dialog ─── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tìm kiếm sản phẩm"
        className="fixed inset-x-0 top-0 z-[9999] flex justify-center px-4 pt-6 sm:pt-14"
        style={{
          pointerEvents: openModal ? "auto" : "none",
          opacity: openModal ? 1 : 0,
          transform: openModal ? "translateY(0)" : "translateY(-16px)",
          transition: "opacity 0.22s ease, transform 0.22s ease",
        }}
      >
        <div
          className="w-full max-w-2xl flex flex-col overflow-hidden rounded-2xl shadow-2xl"
          style={{ background: "#fff", border: "1px solid #e5e7eb", maxHeight: "85dvh" }}
        >
          {/* ─── Input row ─── */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100">
            {/* Search icon */}
            <svg className="w-5 h-5 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>

            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setActiveIndex(-1); }}
              onKeyDown={handleKeyDown}
              placeholder="Tìm kiếm sản phẩm..."
              className="flex-1 bg-transparent text-[17px] font-medium text-black placeholder-neutral-300 outline-none"
              autoComplete="off"
              spellCheck="false"
            />

            {/* Clear button */}
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(""); setResults([]); inputRef.current?.focus(); }}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                aria-label="Xóa tìm kiếm"
              >
                <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* ESC hint */}
            <kbd
              onClick={() => setOpenModal(false)}
              className="hidden sm:flex shrink-0 items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 text-[11px] text-neutral-400 font-mono cursor-pointer hover:bg-neutral-200 transition-colors select-none"
            >
              ESC
            </kbd>
          </div>

          {/* ─── Body (scrollable) ─── */}
          <div className="overflow-y-auto overscroll-contain" style={{ scrollbarWidth: "none" }}>

            {/* IDLE: trending tags */}
            {isIdle && (
              <div className="px-5 py-5">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-3">
                  Xu hướng tìm kiếm
                </p>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setTag(tag)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm text-neutral-700 font-medium border border-neutral-200 hover:border-black hover:text-black transition-colors bg-white"
                    >
                      <svg className="w-3 h-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* LOADING: skeleton list */}
            {isLoading && (
              <div className="py-2">
                {Array.from({ length: 4 }).map((_, i) => <ResultSkeleton key={i} />)}
              </div>
            )}

            {/* EMPTY */}
            {isEmpty && (
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-black">Không tìm thấy kết quả</p>
                <p className="text-sm text-neutral-400 mt-1">
                  Thử từ khóa khác cho &ldquo;<span className="text-black font-medium">{debouncedTerm}</span>&rdquo;
                </p>
              </div>
            )}

            {/* RESULTS */}
            {hasResults && (
              <>
                <div className="px-5 pt-4 pb-1">
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400">
                    Kết quả ({results.length})
                  </p>
                </div>

                <ul role="listbox">
                  {results.map((item, idx) => {
                    const isActive = idx === activeIndex;
                    const img = item.productStyles?.[0]?.images?.[0];
                    const hasDiscount = item.salePrice < item.price;

                    return (
                      <li
                        key={item._id}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => goToProduct(item.slug)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className="flex items-center gap-4 px-5 py-3 cursor-pointer transition-colors"
                        style={{ backgroundColor: isActive ? "#f9fafb" : "transparent" }}
                      >
                        {/* Thumbnail */}
                        <div
                          className="w-14 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-100"
                        >
                          {img ? (
                            <img
                              src={img}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black line-clamp-2 leading-snug">
                            {item.title}
                          </p>
                          {item.productStyles?.[0]?.colorName && (
                            <p className="text-xs text-neutral-400 mt-0.5">{item.productStyles[0].colorName}</p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-black">
                            {item.salePrice.toLocaleString("vi-VN")}đ
                          </p>
                          {hasDiscount && (
                            <p className="text-xs text-neutral-400 line-through">
                              {item.price.toLocaleString("vi-VN")}đ
                            </p>
                          )}
                        </div>

                        {/* Arrow */}
                        <svg
                          className={`w-4 h-4 shrink-0 transition-opacity ${isActive ? "opacity-100 text-black" : "opacity-0 text-neutral-300"}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </li>
                    );
                  })}
                </ul>

                {/* View all button */}
                <div className="px-5 py-4 border-t border-neutral-100">
                  <button
                    onClick={goToCollection}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-black hover:bg-neutral-800 active:scale-[0.99] transition-all"
                  >
                    Xem tất cả kết quả cho &ldquo;{debouncedTerm}&rdquo;
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ─── Footer hint ─── */}
          <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 border-t border-neutral-100 bg-neutral-50/60">
            {[
              { keys: ["↑", "↓"], label: "điều hướng" },
              { keys: ["↵"], label: "chọn" },
              { keys: ["Esc"], label: "đóng" },
            ].map(({ keys, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                {keys.map((k) => (
                  <kbd key={k} className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-[10px] font-mono text-neutral-500 shadow-sm">
                    {k}
                  </kbd>
                ))}
                <span className="text-[11px] text-neutral-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default Search;
