import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

interface DropdownProps<T extends string | number | boolean> {
  options: { label: string; value: T; icon?: React.ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

const CustomDropdown = <T extends string | number | boolean>({
  options,
  value,
  onChange,
  placeholder,
  icon,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative flex-1 min-w-[150px]" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between gap-3 px-4 py-2.5 bg-neutral-50/50 border border-neutral-200 text-[11px] font-semibold tracking-wide transition-all duration-300 w-full group hover:border-neutral-400 hover:bg-white rounded-md",
          isOpen &&
            "border-neutral-900 bg-white shadow-sm ring-1 ring-neutral-900/5",
        )}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {icon && (
            <span className="text-neutral-400 group-hover:text-neutral-600 transition-colors flex-shrink-0">
              {icon}
            </span>
          )}
          <span
            className={cn(
              "truncate",
              selectedOption?.value !== "all"
                ? "text-neutral-900"
                : "text-neutral-500",
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-neutral-400 transition-transform duration-300 flex-shrink-0",
            isOpen && "rotate-180 text-neutral-900",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-md shadow-xl shadow-neutral-900/5 z-50 overflow-hidden min-w-[220px]"
          >
            <div className="max-h-60 overflow-y-auto py-1.5 custom-scrollbar">
              {options.map((option) => (
                <button
                  key={String(option.value)}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-[11px] font-medium hover:bg-neutral-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {option.icon && (
                      <span
                        className={cn(
                          "transition-colors flex-shrink-0",
                          value === option.value
                            ? "text-neutral-900"
                            : "text-neutral-400 group-hover:text-neutral-700",
                        )}
                      >
                        {option.icon}
                      </span>
                    )}
                    <span
                      className={cn(
                        "truncate",
                        value === option.value
                          ? "text-neutral-900 font-semibold"
                          : "text-neutral-600 group-hover:text-neutral-900",
                      )}
                    >
                      {option.label}
                    </span>
                  </div>
                  {value === option.value && (
                    <Check className="w-3.5 h-3.5 text-neutral-900 flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;