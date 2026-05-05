import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Clock, Activity, Truck, PackageCheck, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

interface OrderStatusDropdownProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

const statusOptions = [
  { value: "pending", label: "Chờ xử lý", icon: Clock, color: "text-amber-500" },
  { value: "processing", label: "Đang xử lý", icon: Activity, color: "text-blue-500" },
  { value: "shipped", label: "Đang giao", icon: Truck, color: "text-indigo-500" },
  { value: "delivered", label: "Đã giao", icon: PackageCheck, color: "text-emerald-500" },
  { value: "cancelled", label: "Đã hủy", icon: XCircle, color: "text-red-500" },
];

const OrderStatusDropdown: React.FC<OrderStatusDropdownProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = statusOptions.find((opt) => opt.value === currentStatus) || statusOptions[0];
  const SelectedIcon = selectedOption.icon;

  return (
    <div className="relative inline-block text-left w-full min-w-[150px] max-w-[160px]" ref={containerRef} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between gap-3 px-4 py-2 bg-neutral-50/50 border border-neutral-200 text-[11px] font-semibold tracking-wide transition-all duration-300 w-full group hover:border-neutral-400 hover:bg-white rounded-md",
          isOpen && "border-neutral-900 bg-white shadow-sm ring-1 ring-neutral-900/5"
        )}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <SelectedIcon className={cn("w-3.5 h-3.5 flex-shrink-0 transition-colors", selectedOption.color)} />
          <span className="truncate text-neutral-900 mt-0.5">{selectedOption.label}</span>
        </div>
        <ChevronDown
          className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform duration-300 flex-shrink-0", isOpen && "rotate-180 text-neutral-900")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 bg-white border border-neutral-200 rounded-md shadow-xl shadow-neutral-900/5 z-50 overflow-hidden min-w-[200px]"
          >
            <div className="max-h-60 overflow-y-auto py-1.5 custom-scrollbar">
              {statusOptions.map((option) => {
                const OptionIcon = option.icon;
                const isSelected = currentStatus === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      onStatusChange(option.value);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 text-[11px] font-medium hover:bg-neutral-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={cn(
                          "transition-colors flex-shrink-0",
                          isSelected
                            ? option.color
                            : "text-neutral-400 group-hover:text-neutral-700"
                        )}
                      >
                        <OptionIcon className="w-3.5 h-3.5" />
                      </span>
                      <span
                        className={cn(
                          "truncate mt-0.5",
                          isSelected
                            ? "text-neutral-900 font-semibold"
                            : "text-neutral-600 group-hover:text-neutral-900"
                        )}
                      >
                        {option.label}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-neutral-900 flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderStatusDropdown;
