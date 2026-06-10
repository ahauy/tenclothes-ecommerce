import React, { useState, useEffect, useCallback } from "react";
import {
  Star,
  Check,
  X,
  MessageSquare,
  Calendar,
  Eye,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ShoppingBag,
  User,
  Info,
  Maximize2,
  Trash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { reviewService } from "../services/review.service";
import type { IReviewAdmin } from "../interfaces/review.interface";
import { cn } from "../utils/cn";
import { toast } from "sonner";
import type { IJsonFail } from "../interfaces/api.interface";
import CustomDropdown from "../components/UI/CustomDropdown";
import Pagination from "../components/UI/Pagination";
import { io } from "socket.io-client";

interface UserStrikeBadgeProps {
  strikeCount?: number;
  isActive?: boolean;
}

const UserStrikeBadge: React.FC<UserStrikeBadgeProps> = ({
  strikeCount = 0,
  isActive = true,
}) => {
  if (isActive === false) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-900 border border-red-300/80 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-[0_1px_2px_rgba(0,0,0,0.02)] shrink-0 leading-none">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600" />
        </span>
        <span>Đã khóa</span>
      </span>
    );
  }

  if (strikeCount === 1) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-yellow-50/60 text-yellow-800 border border-yellow-200/60 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-[0_1px_2px_rgba(0,0,0,0.02)] shrink-0 leading-none">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
        <span>Cảnh cáo (1 Gậy)</span>
      </span>
    );
  }

  if (strikeCount === 2) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-900 border border-orange-200 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-[0_1px_2px_rgba(0,0,0,0.02)] shrink-0 leading-none">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500" />
        </span>
        <span>Cảnh cáo (2 Gậy)</span>
      </span>
    );
  }

  if (strikeCount >= 3) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-900 border border-red-300/80 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-[0_1px_2px_rgba(0,0,0,0.02)] shrink-0 leading-none">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600" />
        </span>
        <span>Đã khóa ({strikeCount} Gậy)</span>
      </span>
    );
  }

  return null;
};

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<IReviewAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters State
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [aiFilter, setAiFilter] = useState<string>("all");

  // Stats State
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    flagged: 0,
  });

  // Modal Detail State
  const [selectedReview, setSelectedReview] = useState<IReviewAdmin | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeZoomImage, setActiveZoomImage] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [strikeTargetId, setStrikeTargetId] = useState<string | null>(null);
  const [isStrikeModalOpen, setIsStrikeModalOpen] = useState(false);

  // Action Loading State
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const [totalRes, pendingRes, flaggedRes, rejectedRes] = await Promise.all(
        [
          reviewService.getReviews({ limit: 1 }),
          reviewService.getReviews({ status: "pending", limit: 1 }),
          reviewService.getReviews({ aiStatus: "flagged", limit: 1 }),
          reviewService.getReviews({ aiStatus: "rejected", limit: 1 }),
        ],
      );
      setStats({
        total: totalRes.data?.pagination?.totalItems || 0,
        pending: pendingRes.data?.pagination?.totalItems || 0,
        flagged:
          (flaggedRes.data?.pagination?.totalItems || 0) +
          (rejectedRes.data?.pagination?.totalItems || 0),
      });
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number | boolean | undefined> = {
        page,
        limit: 8,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      if (aiFilter !== "all") {
        params.aiStatus = aiFilter;
      }

      const response = await reviewService.getReviews(params);
      setReviews(response.data.reviews || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalElements(response.data.pagination?.totalItems || 0);
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Không thể tải danh sách đánh giá");
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, aiFilter]);

  // Fetch reviews on filter/page change
  useEffect(() => {
    fetchReviews()
  }, [fetchReviews]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Setup WebSocket connection for real-time review notifications
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    console.log("[Reviews Socket] Connecting to socket server at:", API_URL);
    const socket = io(API_URL);

    socket.on("connect", () => {
      console.log(
        "[Reviews Socket] Connected successfully with ID:",
        socket.id,
      );
    });

    socket.on("connect_error", (error) => {
      console.error("[Reviews Socket] Connection error:", error);
    });

    socket.on("newReview", (newReview: IReviewAdmin) => {
      console.log("[Reviews Socket] Received newReview event:", newReview);
      fetchStats();
      fetchReviews();

      toast.custom(
        (t) => (
          <div className="bg-white border border-neutral-200 p-4 rounded-xl shadow-2xl flex items-start gap-4 w-[380px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-neutral-900" />
            <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-neutral-900" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Đánh giá mới
                </p>
                <span
                  className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider",
                    newReview.status === "pending"
                      ? "text-amber-600 bg-amber-50"
                      : "text-emerald-600 bg-emerald-50",
                  )}
                >
                  {newReview.status === "pending"
                    ? "Chờ duyệt"
                    : "Tự động duyệt"}
                </span>
              </div>
              <p className="text-[13px] font-bold text-neutral-900 truncate">
                {newReview.userId?.fullName || "Người dùng ẩn"}
              </p>
              <p className="text-[11px] text-neutral-500 font-medium truncate mt-0.5">
                Sản phẩm: {newReview.productId?.title || "Không rõ sản phẩm"}
              </p>
              <p className="text-[11px] text-neutral-400 italic line-clamp-2 mt-1">
                "{newReview.content}"
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                <span className="text-[10px] font-semibold text-neutral-450">
                  Đánh giá: {newReview.rating}★
                </span>
                <button
                  onClick={() => {
                    handleOpenDetail(newReview);
                    toast.dismiss(t);
                  }}
                  className="text-[10px] font-bold uppercase tracking-wider text-neutral-900 hover:underline"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-neutral-900 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
        { duration: 8000, position: "top-right" },
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchReviews, fetchStats]);

  const handleApprove = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActionInProgress(id);
    try {
      await reviewService.approveReview(id);
      toast.success("Phê duyệt đánh giá thành công!");
      fetchReviews();
      fetchStats();
      if (selectedReview && selectedReview._id === id) {
        setSelectedReview((prev) =>
          prev ? { ...prev, status: "approved" } : null,
        );
      }
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Phê duyệt thất bại. Vui lòng thử lại!");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActionInProgress(id);
    try {
      await reviewService.rejectReview(id);
      toast.success("Từ chối đánh giá thành công!");
      fetchReviews();
      fetchStats();
      if (selectedReview && selectedReview._id === id) {
        setSelectedReview((prev) =>
          prev ? { ...prev, status: "rejected" } : null,
        );
      }
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Từ chối thất bại. Vui lòng thử lại!");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    setActionInProgress(deleteTargetId);
    try {
      await reviewService.deleteReview(deleteTargetId);
      toast.success("Xóa đánh giá thành công!");
      fetchReviews();
      fetchStats();
      if (selectedReview && selectedReview._id === deleteTargetId) {
        handleCloseDetail();
      }
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Xóa thất bại. Vui lòng thử lại!");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleStrike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStrikeTargetId(id);
    setIsStrikeModalOpen(true);
  };

  const confirmStrike = async () => {
    if (!strikeTargetId) return;

    setActionInProgress(strikeTargetId);
    try {
      const res = await reviewService.strikeUser(strikeTargetId);
      toast.success(res?.message || "Đánh gậy và gửi cảnh báo thành công!");
      fetchReviews();
      fetchStats();
      if (selectedReview && selectedReview._id === strikeTargetId) {
        setSelectedReview((prev) =>
          prev
            ? {
                ...prev,
                status: "rejected",
                isStruck: true,
                userId: prev.userId
                  ? {
                      ...prev.userId,
                      strikeCount: res.data?.userStrikeCount,
                      isActive: res.data?.userIsActive,
                    }
                  : null,
              }
            : null,
        );
      }
      setIsStrikeModalOpen(false);
      setStrikeTargetId(null);
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Đánh gậy thất bại. Vui lòng thử lại!");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleOpenDetail = (review: IReviewAdmin) => {
    setSelectedReview(review);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    // Keep selected review until animation completes
    setTimeout(() => {
      setSelectedReview(null);
      setActiveZoomImage(null);
    }, 200);
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setAiFilter("all");
    setPage(1);
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors",
              i < rating
                ? "text-neutral-900 fill-neutral-900"
                : "text-neutral-200 fill-neutral-50",
            )}
          />
        ))}
      </div>
    );
  };

  const statusOptions = [
    {
      label: "Tất cả trạng duyệt",
      value: "all",
      icon: <Activity className="w-3.5 h-3.5" />,
    },
    {
      label: "Chờ phê duyệt",
      value: "pending",
      icon: <Info className="w-3.5 h-3.5 text-amber-500" />,
    },
    {
      label: "Đã phê duyệt",
      value: "approved",
      icon: <Check className="w-3.5 h-3.5 text-emerald-500" />,
    },
    {
      label: "Đã từ chối/ẩn",
      value: "rejected",
      icon: <X className="w-3.5 h-3.5 text-red-500" />,
    },
  ];

  const aiOptions = [
    {
      label: "Tất cả kết quả AI",
      value: "all",
      icon: <Shield className="w-3.5 h-3.5" />,
    },
    {
      label: "Được AI thông qua",
      value: "approved",
      icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
    },
    {
      label: "AI cảnh báo (Flagged)",
      value: "flagged",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />,
    },
    {
      label: "AI từ chối (Rejected)",
      value: "rejected",
      icon: <XCircle className="w-3.5 h-3.5 text-red-500" />,
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full pb-10 mx-auto">
      {/* Header */}
      <div className="flex flex-col space-y-1.5 px-2 sm:px-0">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] block">
          QUẢN TRỊ NỘI DUNG
        </span>
        <h2 className="text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight">
          Đánh giá & Phản hồi
        </h2>
        <p className="text-neutral-500 font-medium text-sm hidden md:block">
          Kiểm duyệt các phản hồi từ khách hàng và phân tích tự động mức độ an
          toàn nội dung sử dụng trí tuệ nhân tạo.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-2 sm:px-0">
        {/* Total Reviews Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
          <div className="flex items-start justify-between">
            <div className="p-2.5 bg-neutral-900 rounded-lg text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-neutral-400 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-100">
              HỆ THỐNG
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
              Tổng đánh giá
            </p>
            <p className="text-2xl font-bold text-neutral-900 tracking-tight">
              {stats.total}
            </p>
          </div>
        </div>

        {/* Pending Approval Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
          <div className="flex items-start justify-between">
            <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600 border border-amber-100">
              <Info className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-amber-500 bg-amber-50/50 px-2 py-1 rounded-md border border-amber-100/50">
              YÊU CẦU DUYỆT
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
              Chờ phê duyệt
            </p>
            <p className="text-2xl font-bold text-neutral-900 tracking-tight">
              {stats.pending}
            </p>
          </div>
        </div>

        {/* AI Flagged Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
          <div className="flex items-start justify-between">
            <div className="p-2.5 bg-orange-50 rounded-lg text-orange-600 border border-orange-100">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-orange-500 bg-orange-50/50 px-2 py-1 rounded-md border border-orange-100/50">
              CẢNH BÁO TRÍ TUỆ NHÂN TẠO
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
              AI Cảnh báo
            </p>
            <p className="text-2xl font-bold text-neutral-900 tracking-tight">
              {stats.flagged}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full">
          <CustomDropdown
            placeholder="Trạng thái duyệt"
            options={statusOptions}
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val as string);
              setPage(1);
            }}
            icon={<Activity className="w-4 h-4" />}
          />

          <CustomDropdown
            placeholder="Trạng thái AI"
            options={aiOptions}
            value={aiFilter}
            onChange={(val) => {
              setAiFilter(val as string);
              setPage(1);
            }}
            icon={<Shield className="w-4 h-4" />}
          />

          {/* Reset Filters */}
          {(statusFilter !== "all" || aiFilter !== "all") && (
            <button
              onClick={resetFilters}
              title="Xóa tất cả lọc"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 hover:border-red-200 rounded-md transition-colors text-[11px] font-bold uppercase tracking-wider flex-shrink-0 w-full lg:w-auto mt-2 lg:mt-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Xóa Bộ Lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Review Table/Card Content */}
      <div className="w-full min-h-[400px]">
        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {isLoading && reviews.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`sk-mob-${i}`}
                className="bg-white p-4 border border-neutral-200 rounded-xl shadow-sm animate-pulse min-h-[200px] flex flex-col gap-3"
              >
                <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-200" />
                    <div className="space-y-1 mt-0.5">
                      <div className="h-3 w-20 bg-neutral-200 rounded" />
                      <div className="h-2 w-28 bg-neutral-100 rounded" />
                    </div>
                  </div>
                  <div className="w-12 h-4 bg-neutral-200 rounded" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-1/3 bg-neutral-200 rounded" />
                  <div className="h-3 w-full bg-neutral-100 rounded" />
                  <div className="h-3 w-4/5 bg-neutral-100 rounded" />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                  <div className="w-16 h-6 bg-neutral-200 rounded" />
                  <div className="w-20 h-8 bg-neutral-200 rounded" />
                </div>
              </div>
            ))
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: isLoading ? 0.6 : 1, y: 0 }}
                key={review._id}
                onClick={() => handleOpenDetail(review)}
                className="bg-white p-4 border border-neutral-200 rounded-xl shadow-sm hover:shadow-md hover:border-neutral-300 transition-all flex flex-col relative cursor-pointer"
              >
                <div className="flex justify-between items-start border-b border-neutral-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-[10px] font-serif italic text-neutral-600 shrink-0">
                      {review.userId?.fullName?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest truncate">
                        {review.userId?.fullName || "Người dùng ẩn"}
                      </p>
                      {review.userId &&
                        (review.userId.strikeCount > 0 ||
                          review.userId.isActive === false) && (
                          <div className="mt-1">
                            <UserStrikeBadge
                              strikeCount={review.userId.strikeCount}
                              isActive={review.userId.isActive}
                            />
                          </div>
                        )}
                      <p className="text-[9px] text-neutral-400 font-medium mt-1">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded border",
                      review.status === "approved" &&
                        "bg-emerald-50 text-emerald-600 border-emerald-100",
                      review.status === "pending" &&
                        "bg-amber-50 text-amber-600 border-amber-100",
                      review.status === "rejected" &&
                        "bg-red-50 text-red-600 border-red-100",
                    )}
                  >
                    {review.status === "approved"
                      ? "Đã duyệt"
                      : review.status === "pending"
                        ? "Chờ duyệt"
                        : "Đã ẩn"}
                  </span>
                </div>

                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex justify-between items-center">
                    <StarRating rating={review.rating} />
                    {review.variantInfo && (
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                        Size {review.variantInfo.size} //{" "}
                        {review.variantInfo.color}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-neutral-700 line-clamp-3 italic mt-1 font-medium">
                    "{review.content}"
                  </p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-1.5 mt-2 overflow-x-auto py-0.5">
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Review attachment"
                          className="w-10 h-10 object-cover rounded border border-neutral-100"
                        />
                      ))}
                    </div>
                  )}

                  {/* AI Status summary for mobile */}
                  {review.aiStatus && review.aiStatus !== "approved" && (
                    <div className="flex items-center gap-1.5 bg-orange-50/50 border border-orange-100/60 p-2 rounded-lg mt-2 text-[10px] text-orange-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate">
                        AI: {review.aiReason || "Phát hiện nội dung bất thường"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-neutral-100 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-semibold text-neutral-400">
                      Hữu ích:{" "}
                      <span className="font-bold text-neutral-700">
                        {review.isHelpfulCount}
                      </span>
                    </span>
                  </div>

                  <div
                    className="flex gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {review.status !== "approved" && (
                      <button
                        onClick={(e) => handleApprove(review._id, e)}
                        disabled={actionInProgress === review._id}
                        className="p-1.5 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-600 rounded transition-colors disabled:opacity-50"
                        title="Phê duyệt"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {review.status !== "rejected" && (
                      <button
                        onClick={(e) => handleReject(review._id, e)}
                        disabled={actionInProgress === review._id}
                        className="p-1.5 bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 rounded transition-colors disabled:opacity-50"
                        title="Từ chối/Ẩn"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {review.userId &&
                      review.userId.isActive !== false &&
                      !review.isStruck && (
                        <button
                          onClick={(e) => handleStrike(review._id, e)}
                          disabled={actionInProgress === review._id}
                          className="p-1.5 bg-orange-50 border border-orange-100 hover:bg-orange-100 text-orange-600 rounded transition-colors disabled:opacity-50"
                          title="Cảnh cáo & Đánh gậy"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    <button
                      onClick={(e) => handleDelete(review._id, e)}
                      disabled={actionInProgress === review._id}
                      className="p-1.5 bg-red-50 border border-red-100 hover:bg-red-150 hover:border-red-200 text-red-600 rounded transition-colors disabled:opacity-50"
                      title="Xóa vĩnh viễn"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl p-16 text-center col-span-full flex flex-col items-center justify-center">
              <MessageSquare className="w-10 h-10 text-neutral-200 mb-3" />
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                Không tìm thấy đánh giá
              </p>
            </div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden lg:block bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest w-[18%]">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest w-[20%]">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest w-[12%]">
                  Đánh giá
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest w-[25%]">
                  Nội dung
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest w-[13%]">
                  Kiểm duyệt AI
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center w-[12%]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <AnimatePresence>
                {isLoading && reviews.length === 0 ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr
                      key={`sk-desk-${i}`}
                      className="animate-pulse border-b border-neutral-100 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <div className="flex gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-neutral-200" />
                          <div className="space-y-1.5 mt-0.5">
                            <div className="h-3 w-16 bg-neutral-200 rounded" />
                            <div className="h-2 w-24 bg-neutral-100 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <div className="w-8 h-8 bg-neutral-200 rounded" />
                          <div className="space-y-1.5 mt-0.5">
                            <div className="h-3 w-28 bg-neutral-200 rounded" />
                            <div className="h-2.5 w-14 bg-neutral-100 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="h-3 w-14 bg-neutral-200 rounded" />
                          <div className="h-2 w-10 bg-neutral-100 rounded" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="h-3 w-full bg-neutral-100 rounded" />
                          <div className="h-3 w-4/5 bg-neutral-100 rounded" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 w-20 bg-neutral-200 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-1.5">
                          <div className="w-7 h-7 bg-neutral-200 rounded" />
                          <div className="w-7 h-7 bg-neutral-200 rounded" />
                          <div className="w-7 h-7 bg-neutral-200 rounded" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : reviews.length > 0 ? (
                  reviews.map((review) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isLoading ? 0.6 : 1 }}
                      exit={{ opacity: 0 }}
                      key={review._id}
                      onClick={() => handleOpenDetail(review)}
                      className="group hover:bg-neutral-50/50 transition-colors duration-200 cursor-pointer"
                    >
                      {/* Customer Info */}
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center text-[10px] font-serif italic text-neutral-600 shrink-0 mt-0.5">
                            {review.userId?.fullName?.charAt(0) || "U"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-tight truncate max-w-[150px]">
                              {review.userId?.fullName || "Người dùng ẩn"}
                            </p>
                            {review.userId &&
                              (review.userId.strikeCount > 0 ||
                                review.userId.isActive === false) && (
                                <div className="mt-1">
                                  <UserStrikeBadge
                                    strikeCount={review.userId.strikeCount}
                                    isActive={review.userId.isActive}
                                  />
                                </div>
                              )}
                            <p className="text-[9px] text-neutral-400 font-medium truncate max-w-[150px] mt-0.5">
                              {review.userId?.email || ""}
                            </p>
                            <p className="text-[8px] font-bold text-neutral-400 flex items-center gap-1 mt-1">
                              <Calendar className="w-2.5 h-2.5" />
                              {new Date(review.createdAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Product Detail */}
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-start gap-2.5">
                          {review.productId?.thumbnail ? (
                            <img
                              src={review.productId.thumbnail}
                              alt={review.productId.title}
                              className="w-8 h-8 object-cover rounded border border-neutral-150 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 shrink-0">
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p
                              className="text-[11px] font-bold text-neutral-900 truncate max-w-[180px]"
                              title={review.productId?.title}
                            >
                              {review.productId?.title ||
                                "Sản phẩm không tồn tại"}
                            </p>
                            {review.variantInfo && (
                              <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                                Size: {review.variantInfo.size} //{" "}
                                {review.variantInfo.color}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Rating & Helper Counts */}
                      <td className="px-6 py-4 align-top">
                        <div className="space-y-1">
                          <StarRating rating={review.rating} />
                          <p className="text-[9px] text-neutral-400 font-semibold">
                            Hữu ích:{" "}
                            <span className="font-bold text-neutral-700">
                              {review.isHelpfulCount}
                            </span>
                          </p>
                        </div>
                      </td>

                      {/* Content & Images */}
                      <td className="px-6 py-4 align-top">
                        <div className="space-y-1.5 max-w-[320px]">
                          <p className="text-[11px] text-neutral-700 line-clamp-2 italic leading-relaxed font-medium">
                            "{review.content}"
                          </p>
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-1 mt-1 overflow-x-auto py-0.5">
                              {review.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt="Review content"
                                  className="w-8 h-8 object-cover rounded border border-neutral-100"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* AI Moderation & Status */}
                      <td className="px-6 py-4 align-top">
                        <div className="space-y-1.5">
                          {/* AI Status Badge */}
                          <div className="inline-flex">
                            {review.aiStatus === "approved" ||
                            !review.aiStatus ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5 flex items-center gap-1">
                                <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                                An toàn
                              </span>
                            ) : review.aiStatus === "flagged" ? (
                              <span className="bg-orange-50 text-orange-700 border border-orange-100 text-[8px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5 flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5 text-orange-500" />
                                Cảnh báo
                              </span>
                            ) : (
                              <span className="bg-red-50 text-red-700 border border-red-100 text-[8px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5 flex items-center gap-1">
                                <XCircle className="w-2.5 h-2.5 text-red-500" />
                                Nguy hiểm
                              </span>
                            )}
                          </div>

                          {/* System Status Badge */}
                          <div className="block">
                            <span
                              className={cn(
                                "text-[8px] font-bold uppercase tracking-wider",
                                review.status === "approved" &&
                                  "text-emerald-500",
                                review.status === "pending" && "text-amber-500",
                                review.status === "rejected" && "text-red-500",
                              )}
                            >
                              •{" "}
                              {review.status === "approved"
                                ? "Đang hiện"
                                : review.status === "pending"
                                  ? "Chờ duyệt"
                                  : "Đã ẩn"}
                            </span>
                          </div>

                          {review.aiReason && (
                            <p
                              className="text-[9px] text-orange-700 leading-normal line-clamp-1 max-w-[140px]"
                              title={review.aiReason}
                            >
                              {review.aiReason}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td
                        className="px-6 py-4 text-right align-top"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-center items-center gap-1">
                          <button
                            onClick={() => handleOpenDetail(review)}
                            className="p-1.5 border border-neutral-100 hover:bg-neutral-50 text-neutral-500 hover:text-neutral-900 rounded transition-all shadow-sm bg-white"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {review.status !== "approved" && (
                            <button
                              onClick={(e) => handleApprove(review._id, e)}
                              disabled={actionInProgress === review._id}
                              className="p-1.5 border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded transition-all shadow-sm"
                              title="Phê duyệt"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {review.status !== "rejected" && (
                            <button
                              onClick={(e) => handleReject(review._id, e)}
                              disabled={actionInProgress === review._id}
                              className="p-1.5 border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-all shadow-sm"
                              title="Từ chối/Ẩn"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {review.userId &&
                            review.userId.isActive !== false &&
                            !review.isStruck && (
                              <button
                                onClick={(e) => handleStrike(review._id, e)}
                                disabled={actionInProgress === review._id}
                                className="p-1.5 border border-orange-100 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded transition-all shadow-sm"
                                title="Cảnh cáo & Đánh gậy"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </button>
                            )}

                          <button
                            onClick={(e) => handleDelete(review._id, e)}
                            disabled={actionInProgress === review._id}
                            className="p-1.5 border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-all shadow-sm"
                            title="Xóa vĩnh viễn"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <MessageSquare className="w-10 h-10 text-neutral-200" />
                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                          Danh sách trống
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm mt-4">
          <p className="text-[11px] text-neutral-500 font-medium">
            Hiển thị{" "}
            <span className="font-bold text-neutral-900">{reviews.length}</span>{" "}
            trên tổng số{" "}
            <span className="font-bold text-neutral-900">{totalElements}</span>{" "}
            đánh giá
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Review Detail Drawer */}
      <AnimatePresence>
        {isDetailModalOpen && selectedReview && (
          <>
            {/* Backdrop - Full screen but under Sidebar (z-50 < z-60) to keep Sidebar clickable */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetail}
              className="fixed inset-0 bg-neutral-950/20 backdrop-blur-[4px] z-[90]"
            />

            {/* Drawer Body - Slides from right-to-left */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-[0_0_60px_rgba(0,0,0,0.03)] z-100 flex flex-col border-l border-neutral-100"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-8 py-5 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-medium text-neutral-400 tracking-[0.2em] uppercase">
                    CHI TIẾT ĐÁNH GIÁ
                  </span>
                  <span className="text-neutral-300 font-light">•</span>
                  <span className="font-mono text-[9px] text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200/50">
                    MÃ:{" "}
                    {selectedReview._id.substring(
                      selectedReview._id.length - 8,
                    )}
                  </span>
                </div>
                <button
                  onClick={handleCloseDetail}
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-50"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-8 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
                {/* 2-Column Overview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Customer & Product Info */}
                  <div className="space-y-4">
                    {/* Customer details card */}
                    <div className="border border-neutral-200/60 rounded-xl p-4 space-y-3 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                      <h4 className="text-[9px] font-semibold text-neutral-450 uppercase tracking-widest flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-neutral-400" /> Khách
                        hàng
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-neutral-950 text-neutral-50 rounded-full flex items-center justify-center text-[12px] font-serif italic shrink-0">
                          {selectedReview.userId?.fullName?.charAt(0) || "U"}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider truncate">
                            {selectedReview.userId?.fullName || "Người dùng ẩn"}
                          </p>
                          {selectedReview.userId &&
                            (selectedReview.userId.strikeCount > 0 ||
                              selectedReview.userId.isActive === false) && (
                              <div className="mt-1">
                                <UserStrikeBadge
                                  strikeCount={
                                    selectedReview.userId.strikeCount
                                  }
                                  isActive={selectedReview.userId.isActive}
                                />
                              </div>
                            )}
                          <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                            {selectedReview.userId?.email ||
                              "Chưa cập nhật email"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Product details card */}
                    <div className="border border-neutral-200/60 rounded-xl p-4 space-y-3 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                      <h4 className="text-[9px] font-semibold text-neutral-450 uppercase tracking-widest flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />{" "}
                        Sản phẩm mua
                      </h4>
                      <div className="flex items-start gap-3">
                        {selectedReview.productId?.thumbnail ? (
                          <img
                            src={selectedReview.productId.thumbnail}
                            alt={selectedReview.productId.title}
                            className="w-11 h-11 object-cover rounded border border-neutral-200/80 shrink-0 bg-white"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 shrink-0">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold text-neutral-900 line-clamp-2 leading-relaxed">
                            {selectedReview.productId?.title ||
                              "Sản phẩm không tồn tại"}
                          </p>
                          {selectedReview.variantInfo && (
                            <p className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest mt-1">
                              Phân loại: size {selectedReview.variantInfo.size}{" "}
                              // màu {selectedReview.variantInfo.color}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: AI Moderation details */}
                  <div className="space-y-4">
                    <div
                      className={cn(
                        "border rounded-xl p-4 space-y-3 h-full flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]",
                        (selectedReview.aiStatus === "approved" ||
                          !selectedReview.aiStatus) &&
                          "bg-emerald-50/10 border-emerald-200/60 text-emerald-800",
                        selectedReview.aiStatus === "flagged" &&
                          "bg-orange-50/10 border-orange-200/60 text-orange-800",
                        selectedReview.aiStatus === "rejected" &&
                          "bg-red-50/10 border-red-200/60 text-red-800",
                      )}
                    >
                      <div>
                        <h4 className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                          <Shield className="w-3.5 h-3.5 text-neutral-400" />{" "}
                          Kiểm duyệt AI
                        </h4>

                        <div className="flex items-center gap-2 mb-3">
                          {selectedReview.aiStatus === "approved" ||
                          !selectedReview.aiStatus ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <span className="text-[11px] font-bold uppercase tracking-wider">
                                Nội dung an toàn
                              </span>
                            </>
                          ) : selectedReview.aiStatus === "flagged" ? (
                            <>
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                              <span className="text-[11px] font-bold uppercase tracking-wider">
                                Cảnh báo nghi ngờ
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-[11px] font-bold uppercase tracking-wider">
                                Vi phạm nội dung
                              </span>
                            </>
                          )}
                        </div>

                        {selectedReview.aiReason ? (
                          <p className="text-[11px] leading-relaxed italic bg-white/70 rounded-lg p-3.5 border border-neutral-100 text-neutral-700 font-serif">
                            "{selectedReview.aiReason}"
                          </p>
                        ) : (
                          <p className="text-[11px] text-neutral-500 bg-white/70 rounded-lg p-3.5 border border-neutral-100">
                            Không phát hiện nội dung độc hại hoặc nhạy cảm trong
                            đánh giá này.
                          </p>
                        )}
                      </div>

                      {/* Small informative footnote */}
                      <p className="text-[8px] text-neutral-400 font-medium tracking-wide">
                        *Kiểm duyệt tự động dựa trên mô hình ngôn ngữ và danh
                        sách từ cấm.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating score, stars and helpful stats */}
                <div className="border-y border-neutral-100 py-6 flex flex-wrap justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest block mb-1">
                        Điểm số
                      </span>
                      <div className="flex items-center gap-2.5">
                        <span className="text-4xl font-extralight text-neutral-900 tracking-tight leading-none">
                          {selectedReview.rating.toFixed(1)}
                        </span>
                        <StarRating rating={selectedReview.rating} />
                      </div>
                    </div>

                    <div className="h-8 w-px bg-neutral-200" />

                    <div>
                      <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest block mb-1">
                        Tương tác
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-500">
                        Có{" "}
                        <span className="font-bold text-neutral-800">
                          {selectedReview.isHelpfulCount}
                        </span>{" "}
                        lượt bình chọn hữu ích
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest block mb-1 text-right">
                      Ngày gửi
                    </span>
                    <span className="text-[11px] font-medium text-neutral-800 block text-right">
                      {new Date(selectedReview.createdAt).toLocaleString(
                        "vi-VN",
                      )}
                    </span>
                  </div>
                </div>

                {/* Review Text content */}
                <div className="space-y-3">
                  <h4 className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest">
                    Nội dung đánh giá
                  </h4>
                  <div className="relative pl-4 border-l-2 border-neutral-950 py-1">
                    <p className="text-[13px] font-serif italic text-neutral-800 leading-[1.8] tracking-wide">
                      "{selectedReview.content}"
                    </p>
                  </div>
                </div>

                {/* Attached Images */}
                {selectedReview.images && selectedReview.images.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest">
                      Hình ảnh đính kèm ({selectedReview.images.length})
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedReview.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative group w-20 h-20 border border-neutral-200 rounded-lg overflow-hidden cursor-zoom-in bg-neutral-50 shadow-sm hover:shadow transition-shadow duration-350"
                          onClick={() => setActiveZoomImage(img)}
                        >
                          <img
                            src={img}
                            alt={`Review attach ${idx}`}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-neutral-950/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                            <Maximize2 className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="px-8 py-5 border-t border-neutral-100 bg-neutral-50/50 flex justify-between items-center mt-auto">
                {/* Left side: System review status info */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest">
                    TRẠNG THÁI HIỂN THỊ:
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider rounded-md px-2.5 py-0.5 border border-neutral-200 bg-white text-neutral-600 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    {selectedReview.status === "approved"
                      ? "Hiển thị"
                      : selectedReview.status === "pending"
                        ? "Chờ duyệt"
                        : "Đã bị ẩn"}
                  </span>
                </div>

                {/* Right side: Approve / Reject / Delete buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCloseDetail}
                    className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 hover:text-neutral-950 transition-colors"
                  >
                    Đóng
                  </button>

                  <button
                    onClick={() => handleDelete(selectedReview._id)}
                    disabled={actionInProgress === selectedReview._id}
                    className="px-4.5 py-2 text-[10px] font-semibold uppercase tracking-widest border border-red-200 text-red-600 bg-red-50/20 hover:bg-red-50 hover:border-red-300 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Trash className="w-3 h-3" /> Xóa vĩnh viễn
                  </button>
                  {selectedReview.userId &&
                    selectedReview.userId.isActive !== false &&
                    !selectedReview.isStruck && (
                      <button
                        onClick={() => {
                          handleStrike(selectedReview._id);
                        }}
                        disabled={actionInProgress === selectedReview._id}
                        className="px-4.5 py-2 text-[10px] font-semibold uppercase tracking-widest border border-orange-200 text-orange-600 bg-orange-50/20 hover:bg-orange-50 hover:border-orange-300 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-3 h-3" /> Đánh gậy
                      </button>
                    )}

                  {selectedReview.status !== "rejected" && (
                    <button
                      onClick={() => handleReject(selectedReview._id)}
                      disabled={actionInProgress === selectedReview._id}
                      className="px-4.5 py-2 text-[10px] font-semibold uppercase tracking-widest border border-neutral-200 text-neutral-600 bg-neutral-50/10 hover:bg-neutral-50 hover:border-neutral-300 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <X className="w-3 h-3" /> Ẩn đánh giá
                    </button>
                  )}

                  {selectedReview.status !== "approved" && (
                    <button
                      onClick={() => handleApprove(selectedReview._id)}
                      disabled={actionInProgress === selectedReview._id}
                      className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest bg-neutral-950 hover:bg-black text-neutral-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm hover:shadow-md"
                    >
                      <Check className="w-3 h-3" /> Phê Duyệt
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (actionInProgress) return;
                setIsDeleteModalOpen(false);
                setDeleteTargetId(null);
              }}
              className="fixed inset-0 bg-neutral-950/20 backdrop-blur-[4px] z-[120]"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 pointer-events-auto"
              >
                {/* Header */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-full">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                      Xác nhận xóa đánh giá
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                      Không thể hoàn tác
                    </p>
                  </div>
                </div>

                {/* Content */}
                {(() => {
                  const targetReview =
                    reviews.find((r) => r._id === deleteTargetId) ||
                    (selectedReview?._id === deleteTargetId
                      ? selectedReview
                      : null);
                  return (
                    <>
                      <p className="text-[12px] text-neutral-600 leading-relaxed font-medium">
                        Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá của{" "}
                        <span className="font-bold text-neutral-900">
                          {targetReview?.userId?.fullName || "Người dùng ẩn"}
                        </span>
                        ? Hệ thống sẽ cập nhật lại điểm đánh giá trung bình của
                        sản phẩm tương ứng.
                      </p>

                      {/* Snippet preview */}
                      {targetReview && (
                        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3.5 my-4 space-y-2 text-left">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                              Nội dung đánh giá
                            </span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-2.5 h-2.5",
                                    i < targetReview.rating
                                      ? "text-neutral-950 fill-neutral-950"
                                      : "text-neutral-200 fill-neutral-50",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-[11px] text-neutral-600 line-clamp-3 italic leading-relaxed font-medium">
                            "{targetReview.content}"
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setDeleteTargetId(null);
                    }}
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-all"
                    disabled={actionInProgress === deleteTargetId}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    disabled={actionInProgress === deleteTargetId}
                  >
                    {actionInProgress === deleteTargetId ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash className="w-3.5 h-3.5" />
                    )}
                    <span>Xác nhận xóa</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Strike Confirmation Modal */}
      <AnimatePresence>
        {isStrikeModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (actionInProgress) return;
                setIsStrikeModalOpen(false);
                setStrikeTargetId(null);
              }}
              className="fixed inset-0 bg-neutral-950/20 backdrop-blur-[4px] z-[120]"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 pointer-events-auto"
              >
                {/* Header */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="p-3 bg-orange-50 border border-orange-100 text-orange-600 rounded-full">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                      Xác nhận đánh gậy & cảnh cáo
                    </h3>
                    <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">
                      Cảnh cáo vi phạm nội dung
                    </p>
                  </div>
                </div>

                {/* Content */}
                {(() => {
                  const targetReview =
                    reviews.find((r) => r._id === strikeTargetId) ||
                    (selectedReview?._id === strikeTargetId
                      ? selectedReview
                      : null);
                  const currentStrikes = targetReview?.userId?.strikeCount || 0;
                  const futureStrikes = currentStrikes + 1;
                  return (
                    <>
                      <p className="text-[12px] text-neutral-600 leading-relaxed font-medium">
                        Bạn đang thực hiện đánh gậy tài khoản của{" "}
                        <span className="font-bold text-neutral-900">
                          {targetReview?.userId?.fullName || "Người dùng ẩn"}
                        </span>
                        . Hành động này sẽ:
                      </p>
                      <ul className="list-disc pl-5 my-2.5 text-[11px] text-neutral-500 space-y-1 font-medium">
                        <li>
                          Tăng số gậy của người dùng từ{" "}
                          <strong className="text-neutral-700">
                            {currentStrikes}
                          </strong>{" "}
                          lên{" "}
                          <strong className="text-orange-600">
                            {futureStrikes}/3
                          </strong>{" "}
                          gậy.
                        </li>
                        <li>
                          Tự động chuyển trạng thái bình luận đánh giá này thành
                          ẩn (
                          <strong className="text-neutral-750">Từ chối</strong>
                          ).
                        </li>
                        <li>
                          Gửi email cảnh báo chi tiết đính kèm nội dung vi phạm
                          đến địa chỉ hòm thư người dùng.
                        </li>
                        {futureStrikes >= 3 && (
                          <li className="text-red-600 font-bold">
                            Tài khoản này sẽ tự động bị KHÓA do nhận đủ 3 gậy vi
                            phạm!
                          </li>
                        )}
                      </ul>

                      {/* Snippet preview */}
                      {targetReview && (
                        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3.5 my-4 space-y-2 text-left">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">
                            Nội dung đánh giá vi phạm
                          </span>
                          <p className="text-[11px] text-neutral-600 line-clamp-3 italic leading-relaxed font-medium">
                            "{targetReview.content}"
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsStrikeModalOpen(false);
                      setStrikeTargetId(null);
                    }}
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-all"
                    disabled={actionInProgress === strikeTargetId}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={confirmStrike}
                    className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    disabled={actionInProgress === strikeTargetId}
                  >
                    {actionInProgress === strikeTargetId ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    <span>Xác nhận đánh gậy</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox / Zoom Image Modal */}
      <AnimatePresence>
        {activeZoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
            onClick={() => setActiveZoomImage(null)}
          >
            <button
              onClick={() => setActiveZoomImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              src={activeZoomImage}
              alt="Zoomed attachment"
              className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reviews;
