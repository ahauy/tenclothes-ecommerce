import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export interface IColorOption {
  label: string;
  value: string;
  hexCode: string; // Mã màu HEX để render hình tròn
}

interface IColorFilterProps {
  title: string;
  paramKey: string;
  options: IColorOption[];
}

const ColorFilterItem = ({ title, paramKey, options }: IColorFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentValue = searchParams.get(paramKey) || "";

  const handleSelect = (val: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (currentValue == val) {
      newParams.delete(paramKey);
    } else {
      newParams.set(paramKey, val);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="pt-3 border-b border-gray-100 pb-4 last:border-0">
      <div
        className="flex justify-between items-center cursor-pointer mb-1 py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-sm text-gray-800">{title}</h3>
        <FontAwesomeIcon
          icon={faAngleDown}
          className={`text-gray-500 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        {/* Dùng Grid chia 3 cột giống hệt ảnh */}
        <div className="grid grid-cols-3 gap-y-4 gap-x-2">
          {options.map((opt) => {
            const isChecked = currentValue === opt.value

            return (
              <label key={opt.value} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                {/* Vòng tròn bên ngoài dùng để làm viền khi được active */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isChecked ? "border-2 border-black" : "border-2 border-transparent group-hover:border-gray-300"
                  }`}
                >
                  {/* Vòng tròn màu thật sự */}
                  <div
                    className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                    style={{ backgroundColor: opt.hexCode }}
                  ></div>
                </div>
                <span className={`text-[11px] text-center transition-colors ${isChecked ? "font-bold text-black" : "text-gray-600"}`}>
                  {opt.label}
                </span>
                <input
                  type="radio"
                  value={opt.value}
                  checked={isChecked}
                  onChange={() => handleSelect(opt.value)}
                  className="hidden"
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ColorFilterItem;