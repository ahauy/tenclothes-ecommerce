import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

// Định nghĩa props để cha truyền vào
interface IDropdownItemProps {
  placeholder: string; 
  listLocation: { code: number | string; name: string }[];
  handle: (value: number | string) => void;
  selectedValue: number | string;
  disabled?: boolean;
}

const DropdownItem = ({
  placeholder,
  listLocation,
  handle,
  selectedValue,
  disabled = false,
}: IDropdownItemProps) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tìm tên hiển thị dựa trên code đang được chọn
  const selectedName = listLocation.find((item) => {
    return String(item.code) === String(selectedValue)
  })?.name || placeholder;

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gọi hàm handle của cha và đóng menu
  const handleSelectOption = (code: number | string) => {
    handle(code);
    setShowDropDown(false);
  };

  return (
    <div className={`relative text-xs sm:text-sm w-full ${disabled ? "opacity-60 cursor-not-allowed" : ""}`} ref={dropdownRef}>
      {/* Nút Dropdown */}
      <div
        className={`flex justify-between items-center gap-2 border border-gray-400 bg-white px-3 py-3 rounded select-none transition-colors w-full ${
          disabled ? "bg-gray-100 pointer-events-none" : "cursor-pointer hover:border-gray-500"
        }`}
        onClick={() => !disabled && setShowDropDown(!showDropDown)}
      >
        <span className={`truncate ${selectedValue ? "text-gray-900" : "text-gray-500"}`}>
          {selectedName}
        </span>
        <FontAwesomeIcon
          icon={faAngleDown}
          className={`text-gray-500 shrink-0 transition-transform duration-300 ease-in-out ${
            showDropDown ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Menu xổ xuống */}
      {showDropDown && (
        // Thêm max-h-60 và overflow-y-auto để có thanh cuộn nếu list quá dài
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-y-auto max-h-60">
          {listLocation.map((item) => (
            <div
              key={item.code}
              className={`py-2.5 px-4 cursor-pointer transition-colors ${
                selectedValue === item.code
                  ? "bg-gray-100 text-black font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              }`}
              onClick={() => handleSelectOption(item.code)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownItem;