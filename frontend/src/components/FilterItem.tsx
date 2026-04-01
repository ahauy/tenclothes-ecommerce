import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { IFilterProps } from "../interfaces/iFilterOption";

const FilterItem = ({ title, paramKey, options }: IFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentValue: string = searchParams.get(paramKey) || "";
  const activeValues: string[] = currentValue ? currentValue.split(",") : [];
  const isMultiSelect = paramKey.includes("price");

  const handleSelect = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (currentValue === val) {
      newParams.delete(paramKey);
    } else {
      newParams.set(paramKey, val);
    }
    setSearchParams(newParams);
  };

  const handleSelectMulti = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    const currentString = newParams.get(paramKey);

    if (currentString) {
      let valuesArray = currentString.split(",");
      if (valuesArray.includes(val)) {
        valuesArray = valuesArray.filter((item) => item !== val);
      } else {
        valuesArray.push(val);
      }

      if (valuesArray.length > 0) {
        newParams.set(paramKey, valuesArray.join(","));
      } else {
        newParams.delete(paramKey);
      }
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
          className={`text-gray-500 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Hiệu ứng mượt hơn khi mở Filter */}
      <div
        className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        {options.map((opt) => {
          const isChecked = isMultiSelect
            ? activeValues.includes(opt.value)
            : currentValue === opt.value;

          return (
            <label
              key={opt.value}
              // Thêm py-1.5 để tăng vùng chạm (touch target) trên điện thoại
              className="flex items-center gap-3 cursor-pointer group py-1.5"
            >
              <div
                className={`w-4.5 h-4.5 shrink-0 ${
                  isMultiSelect ? "rounded" : "rounded-full"
                } border flex items-center justify-center transition-colors
                ${
                  isChecked
                    ? "border-black bg-black"
                    : "border-gray-300 bg-white group-hover:border-gray-500"
                }`}
              >
                {isChecked &&
                  (isMultiSelect ? (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  ))}
              </div>

              <span
                className={`select-none text-sm transition-colors ${
                  isChecked
                    ? "text-black font-medium"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {opt.label}
              </span>

              <input
                type="checkbox"
                name={paramKey}
                value={opt.value}
                checked={isChecked}
                onChange={() =>
                  isMultiSelect
                    ? handleSelectMulti(opt.value)
                    : handleSelect(opt.value)
                }
                className="hidden"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default FilterItem;
