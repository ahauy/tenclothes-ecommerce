import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SORT_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "Mặc định", value: "default" },
  { label: "Bán chạy", value: "best-selling" },
  { label: "Giá thấp đến cao", value: "price-asc" },
  { label: "Giá cao xuống thấp", value: "price-desc" },
  { label: "% giảm giá nhiều nhất", value: "discount-desc" },
];

const DropDown = () => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSortValueURL: string = searchParams.get("sort") || "default";

  const currentLabel: string = SORT_OPTIONS.find(item => item.value === currentSortValueURL)?.label || "Mặc định";

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelectOption = (sortValue: string): void => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", sortValue);
    setSearchParams(newParams);
    setShowDropDown(false);
  };

  useEffect(() => {
    function handleCloseDropDown(e: MouseEvent): void {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropDown(false);
      }
    }
    document.addEventListener("click", handleCloseDropDown);
    return () => document.removeEventListener("click", handleCloseDropDown);
  }, []);

  return (
    <div className="relative text-xs sm:text-sm" ref={dropdownRef}>
      {/* Nút Dropdown */}
      <div
        className="flex items-center gap-2 border border-gray-300 bg-white px-3 py-2 rounded-lg cursor-pointer select-none hover:border-gray-500 transition-colors"
        onClick={() => setShowDropDown(!showDropDown)}
      >
        <span className="hidden sm:inline text-gray-500 font-medium">Phân loại:</span>
        <span className="font-semibold text-gray-800">{currentLabel}</span>
        <FontAwesomeIcon
          icon={faAngleDown}
          className={`text-gray-500 transition-transform duration-300 ease-in-out ${
            showDropDown ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Menu xổ xuống */}
      {showDropDown && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
          {SORT_OPTIONS.map((item, index) => (
            <div
              key={index}
              className={`py-2.5 px-4 cursor-pointer transition-colors ${
                currentSortValueURL === item.value 
                  ? "bg-gray-100 text-black font-medium" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              }`}
              onClick={() => handleSelectOption(item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;