import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useShopStore } from "../stores/useShopStore";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import api from "../utils/axios";
import Skeleton from "./skeleton/Skeleton"; // Import Skeleton component

export interface ISearchResult {
  _id: string;
  title: string;
  slug: string;
  price: number;
  salePrice: number;
  productStyles: { images: string[] }[];
}

const Search = () => {
  const openModal = useShopStore((state) => state.openModal);
  const setOpenModal = useShopStore((state) => state.setOpenModal);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<ISearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Khóa cuộn trang & focus input khi mở
  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    } else {
      document.body.style.overflow = "unset";
      setSearchTerm("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [openModal]);

  // Gọi API tìm kiếm
  useEffect(() => {
    async function fetchSearchResults() {
      if (debouncedSearchTerm.trim() !== "") {
        setIsLoading(true);
        try {
          const res = await api.get(
            `/products/search?keyword=${debouncedSearchTerm}&limit=4`
          );
          if (res.data.status) {
            setResults(res.data.data);
          }
        } catch (error) {
          console.error("Lỗi tìm kiếm:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }
    fetchSearchResults();
  }, [debouncedSearchTerm]);

  const handleProductClick = (slug: string) => {
    setOpenModal(false);
    navigate(`/product/${slug}`);
  };

  if (document === undefined) return <div className="modal"></div>;

  // Cờ để xác định khi nào cần hiển thị phần nội dung (padding)
  const hasContent =
    isLoading ||
    (debouncedSearchTerm.trim() !== "" && results.length === 0) ||
    results.length > 0;

  return ReactDOM.createPortal(
    <div
      className={`modal search fixed inset-0 flex justify-center items-start sm:pt-10 pt-0 transition-all duration-300 z-[900] ${
        openModal ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Nền mờ */}
      <div
        className="overlay absolute inset-0 bg-black/50 backdrop-blur-sm z-10"
        onClick={() => setOpenModal(false)}
      ></div>

      {/* Main Container - Chiều cao tự động (h-auto) lên đến tối đa 90vh */}
      <div className="relative w-full sm:w-[80vw] xl:w-[65vw] h-auto max-h-dvh sm:max-h-[90vh] bg-white sm:rounded-2xl shadow-2xl z-20 flex flex-col overflow-hidden animate-fade-in-up transition-all duration-300">
        {/* --- Phần Header & Input (Luôn Cố Định) --- */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 shrink-0 bg-white z-30">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-gray-500 text-xl"
          />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 outline-none text-xl sm:text-2xl bg-transparent font-medium text-black placeholder-gray-300"
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setOpenModal(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="text-2xl" />
          </button>
        </div>

        {/* --- Phần Nội dung (Scrollable) --- */}
        <div className="overflow-y-auto custom-scrollbar">
          {hasContent && (
            <div className="p-6 sm:p-10">
              {/* 1. Trạng thái Loading (Skeleton) */}
              {isLoading && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-6">
                    Đang tìm kiếm...
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                    {/* Render 8 ô Skeleton */}
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col h-full cursor-wait"
                      >
                        <Skeleton className="w-full aspect-3/4 rounded-lg mb-4" />
                        <Skeleton className="h-4 sm:h-5 rounded w-3/4 mb-2" />
                        <Skeleton className="h-5 sm:h-6 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Trạng thái Không tìm thấy */}
              {!isLoading &&
                debouncedSearchTerm.trim() !== "" &&
                results.length === 0 && (
                  <div className="text-center py-10 sm:py-20">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="text-5xl text-gray-200 mb-4"
                    />
                    <p className="text-lg text-gray-600">
                      Không tìm thấy kết quả nào cho{" "}
                      <strong className="text-black">
                        "{debouncedSearchTerm}"
                      </strong>
                    </p>
                  </div>
                )}

              {/* 3. Kết quả tìm kiếm (Dạng Lưới/Grid) */}
              {!isLoading && results.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-6">
                    Kết quả tìm kiếm
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                    {results.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleProductClick(item.slug)}
                        className="flex flex-col cursor-pointer group h-full"
                      >
                        {/* Hình ảnh */}
                        <div className="w-full aspect-3/4 bg-[#f4f4f4] rounded-lg overflow-hidden mb-4 relative">
                          <img
                            src={
                              item.productStyles?.[0]?.images?.[0] ||
                              "https://via.placeholder.com/400x500"
                            }
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                          />
                        </div>

                        {/* Thông tin */}
                        <div className="flex flex-col flex-1">
                          <p className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-black transition-colors flex-1">
                            {item.title}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-base sm:text-lg font-bold text-black">
                              {item.salePrice?.toLocaleString("vi-VN")}đ
                            </span>
                            {item.salePrice < item.price && (
                              <span className="text-xs sm:text-sm text-gray-400 line-through">
                                {item.price?.toLocaleString("vi-VN")}đ
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Nút XEM TẤT CẢ */}
                  <div className="flex justify-center mt-12 mb-4">
                    <button
                      className="px-10 py-3.5 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors"
                      onClick={() => {
                        setOpenModal(false);
                        navigate(
                          `/collection/all?keyword=${debouncedSearchTerm}`
                        );
                      }}
                    >
                      XEM TẤT CẢ
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Search;
