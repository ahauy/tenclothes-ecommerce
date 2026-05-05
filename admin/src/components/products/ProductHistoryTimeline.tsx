import React from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { User, Clock, ArrowRight, History } from "lucide-react";
import { cn } from "../../utils/cn";
import type { IProductHistoryEntry } from "../../interfaces/productHistory.interface";

/* ─────────────────────────────────────────────
   Mapping: action → label & accent color
   ───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   Mapping: action → label & accent color
   ───────────────────────────────────────────── */
const ACTION_MAP: Record<
  string,
  { label: string; accent: string; dot: string }
> = {
  CHANGE_FEATURED: {
    label: "Sản phẩm nổi bật",
    accent: "text-amber-600",
    dot: "bg-amber-500",
  },
  CHANGE_STATUS: {
    label: "Trạng thái hiển thị",
    accent: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  UPDATE_INFO: {
    label: "Cập nhật thông tin",
    accent: "text-sky-600",
    dot: "bg-sky-500",
  },
  DELETE: {
    label: "Xóa sản phẩm",
    accent: "text-red-600",
    dot: "bg-red-500",
  },
  CREATE: {
    label: "Khởi tạo sản phẩm",
    accent: "text-violet-600",
    dot: "bg-violet-500",
  },
  RESTORE: {
    label: "Khôi phục sản phẩm",
    accent: "text-indigo-600",
    dot: "bg-indigo-500",
  },
};

const FIELD_LABEL_MAP: Record<string, string> = {
  title: "Tên sản phẩm",
  description: "Mô tả",
  price: "Giá bán",
  discountPercentage: "Giảm giá (%)",
  isFeatured: "Trạng thái nổi bật",
  isActive: "Trạng thái hoạt động",
  categoryIds: "Danh mục",
  productStyles: "Phong cách",
  variants: "Biến thể",
  totalStock: "Tổng tồn kho",
  thumbnail: "Ảnh đại diện",
};

const DEFAULT_ACTION_STYLE = {
  label: "Thao tác hệ thống",
  accent: "text-neutral-600",
  dot: "bg-neutral-400",
};

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */
function formatTimestamp(isoString: string): string {
  return format(parseISO(isoString), "dd/MM/yyyy HH:mm");
}

function formatValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Bật" : "Tắt";
  if (value === null || value === undefined) return "Trống";
  if (Array.isArray(value)) return `[ ${value.length} mục ]`;
  if (typeof value === "object") return "Dữ liệu phức hợp";
  return String(value);
}

function renderChanges(changes: Record<string, { from: unknown; to: unknown }>) {
  if (!changes || Object.keys(changes).length === 0) {
    return (
      <div className="py-1.5 px-3 bg-neutral-50 rounded-md border border-neutral-100 inline-block">
        <span className="text-neutral-400 italic text-[11px] font-medium">
          Không có chi tiết thay đổi
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-1.5 p-3 bg-neutral-50/70 rounded-lg border border-neutral-100/80">
      {Object.entries(changes).map(([field, { from, to }]) => (
        <div key={field} className="flex flex-col sm:flex-row sm:items-start sm:gap-4 gap-1.5">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider w-32 shrink-0 pt-0.5">
            {FIELD_LABEL_MAP[field] || field}
          </span>
          <div className="flex items-center gap-2 flex-wrap text-[11px] font-medium">
            <span className="text-neutral-400 line-through decoration-neutral-300">
              {formatValue(from)}
            </span>
            <ArrowRight className="w-3 h-3 text-neutral-300 shrink-0" />
            <span className="text-neutral-800 bg-white border border-neutral-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] px-1.5 py-0.5 rounded">
              {formatValue(to)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function getRoleBadge(role: string): string {
  const map: Record<string, string> = {
    admin: "Quản trị viên",
    staff: "Nhân viên",
    manager: "Quản lý",
  };
  return map[role] ?? role;
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */
interface ProductHistoryTimelineProps {
  entries: IProductHistoryEntry[];
  isLoading?: boolean;
}

const ProductHistoryTimeline: React.FC<ProductHistoryTimelineProps> = ({
  entries,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6 py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-3 h-3 rounded-full bg-neutral-200 mt-1.5 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-200 rounded w-2/5" />
              <div className="h-3 bg-neutral-100 rounded w-3/5" />
              <div className="h-3 bg-neutral-100 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
        <History className="w-8 h-8 mb-3 opacity-30" />
        <span className="text-xs font-medium tracking-wide">Chưa có lịch sử thao tác</span>
      </div>
    );
  }

  return (
    <div className="relative pl-5">
      {/* Vertical spine */}
      <div className="absolute left-[5px] top-2 bottom-2 w-[1.5px] bg-neutral-200" />

      <div className="space-y-0">
        {entries.map((entry, index) => {
          const style = ACTION_MAP[entry.action] ?? DEFAULT_ACTION_STYLE;

          return (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="relative pb-8 last:pb-0 group"
            >
              {/* Dot on timeline spine */}
              <div
                className={cn(
                  "absolute -left-[20px] top-[14px] w-[9px] h-[9px] rounded-full ring-4 ring-white shadow-sm z-10 transition-transform group-hover:scale-125",
                  style.dot,
                )}
              />

              {/* Card */}
              <div
                className="ml-3 bg-white border border-neutral-200/70 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all hover:shadow-md hover:border-neutral-300"
              >
                {/* Header row: Action badge + Timestamp */}
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      style.accent,
                    )}
                  >
                    {style.label}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium shrink-0 bg-neutral-50 px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(entry.createdAt)}
                  </span>
                </div>

                {/* Change details */}
                <div className="mb-3.5">
                  {renderChanges(entry.changes)}
                </div>

                {/* Actor info */}
                <div className="flex items-center gap-2 pt-3 border-t border-neutral-100/80 mt-1">
                  <div className="w-5 h-5 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                    <User className="w-3 h-3 text-neutral-500" />
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-800">
                    {entry.actorInfo.fullName}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                    {getRoleBadge(entry.actorInfo.role)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductHistoryTimeline;
