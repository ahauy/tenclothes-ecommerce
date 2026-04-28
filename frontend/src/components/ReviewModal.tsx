import { useState, useRef } from "react";
import { toast } from "sonner";
import { reviewService } from "../services/reviewService";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  orderId: string;
  onReviewSuccess: () => void;
}

const RATING_LABELS: Record<number, { text: string; color: string }> = {
  1: { text: "Rất tệ", color: "#ef4444" },
  2: { text: "Kém", color: "#f97316" },
  3: { text: "Bình thường", color: "#eab308" },
  4: { text: "Rất tốt", color: "#22c55e" },
  5: { text: "Tuyệt vời ✦", color: "#22c55e" },
};

const ReviewModal = ({
  isOpen,
  onClose,
  productId,
  orderId,
  onReviewSuccess,
}: ReviewModalProps) => {
  const [rating, setRating] = useState<number>(5);
  const [hovered, setHovered] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const displayRating = hovered || rating;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast.error("Tối đa 5 ảnh");
      return;
    }
    const newImages = [...images, ...files];
    setImages(newImages);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    const newPreviews = [...previewUrls];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);
  };

  const resetState = () => {
    setRating(5);
    setHovered(0);
    setContent("");
    setImages([]);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetState();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 5) {
      toast.error("Nội dung đánh giá quá ngắn (ít nhất 5 ký tự)");
      return;
    }
    try {
      setIsLoading(true);
      await reviewService.createReviewService(
        productId,
        orderId,
        rating,
        content,
        images
      );
      toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
      onReviewSuccess();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = content.trim().length >= 5;

  return (
    <div className="fixed inset-0 z-200 flex items-end sm:items-center justify-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        .review-modal * { font-family: 'Manrope', sans-serif; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .review-backdrop { animation: fadeIn 0.25s ease-out; }
        .review-panel { animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1); }

        .star-btn {
          transition: transform 0.15s ease;
        }
        .star-btn:hover {
          transform: scale(1.2);
        }

        .img-thumb {
          transition: all 0.2s ease;
        }
        .img-thumb:hover .img-overlay {
          opacity: 1;
        }

        .review-textarea:focus {
          box-shadow: 0 0 0 2px rgba(26,26,26,0.12);
        }

        .upload-btn {
          transition: all 0.2s ease;
        }
        .upload-btn:hover {
          background: #f7f8fa;
          border-color: #1a1a1a;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="review-backdrop absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="review-modal review-panel relative z-10 bg-white w-full sm:max-w-md flex flex-col sm:mx-4 shadow-2xl"
        style={{ maxHeight: "92vh" }}
      >
        {/* Top accent bar */}
        <div className="h-0.5 bg-[#1a1a1a] w-full" />

        {/* Header */}
        <div className="px-6 pt-6 pb-5 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca3af] mb-1">
              Đơn hàng đã giao
            </p>
            <h2 className="text-xl font-bold text-[#1a1a1a] tracking-tight leading-tight">
              Đánh giá sản phẩm
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center text-[#9ca3af] hover:text-[#1a1a1a] hover:bg-[#f3f4f6] transition-colors -mt-1 -mr-1 disabled:opacity-40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="h-px bg-[#f3f4f6]" />

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          <form id="review-form" onSubmit={handleSubmit}>
            {/* Star Rating Section */}
            <div className="px-6 py-6 bg-[#fafafa] border-b border-[#f3f4f6]">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9ca3af] mb-4 text-center">
                Chất lượng sản phẩm
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-1.5 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className="star-btn p-1 focus:outline-none"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-9 h-9 sm:w-10 sm:h-10 transition-all duration-150"
                      fill={star <= displayRating ? "#1a1a1a" : "none"}
                      stroke={star <= displayRating ? "#1a1a1a" : "#d1d5db"}
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Rating label */}
              <div className="text-center">
                <span
                  className="text-sm font-bold tracking-wide transition-all duration-200"
                  style={{ color: RATING_LABELS[displayRating]?.color ?? "#1a1a1a" }}
                >
                  {RATING_LABELS[displayRating]?.text}
                </span>
              </div>

              {/* Rating bar */}
              <div className="mt-3 flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className="h-0.5 w-8 transition-all duration-200"
                    style={{
                      background: s <= displayRating ? "#1a1a1a" : "#e5e7eb",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="px-6 py-5 border-b border-[#f3f4f6]">
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#9ca3af] mb-3">
                Nhận xét của bạn <span className="text-[#1a1a1a]">*</span>
              </label>
              <textarea
                id="content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Hãy chia sẻ cảm nhận của bạn về chất lượng, kiểu dáng, độ vừa vặn... (ít nhất 5 ký tự)"
                className="review-textarea w-full px-4 py-3.5 border border-[#e5e7eb] bg-white text-sm text-[#1a1a1a] placeholder:text-[#d1d5db] focus:outline-none focus:border-[#1a1a1a] resize-none transition-all"
              />
              <div className="flex justify-between mt-1.5">
                <p className="text-xs text-[#9ca3af]">
                  {content.trim().length < 5 && content.length > 0
                    ? `Còn ${5 - content.trim().length} ký tự nữa`
                    : ""}
                </p>
                <p className={`text-xs font-medium ${content.trim().length >= 5 ? "text-[#1a1a1a]" : "text-[#9ca3af]"}`}>
                  {content.trim().length} ký tự
                </p>
              </div>
            </div>

            {/* Image Upload */}
            <div className="px-6 py-5">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9ca3af]">
                  Hình ảnh thực tế
                  <span className="text-[#c4c9d4] font-normal normal-case tracking-normal ml-1.5 text-xs">
                    (Tối đa 5 ảnh)
                  </span>
                </label>
                <span
                  className={`text-xs font-semibold ${images.length === 5 ? "text-[#1a1a1a]" : "text-[#9ca3af]"}`}
                >
                  {images.length}/5
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {/* Preview thumbnails */}
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="img-thumb relative w-[72px] h-[72px] border border-[#e5e7eb] overflow-hidden group"
                  >
                    <img
                      src={url}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="img-overlay absolute inset-0 bg-black/50 opacity-0 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-white hover:text-red-300 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Upload button */}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="upload-btn w-18 h-18 border border-dashed border-[#d1d5db] flex flex-col items-center justify-center text-[#9ca3af] hover:text-[#1a1a1a] gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM12 8.25v.008"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V12m0 0l-3 3m3-3l3 3"
                      />
                    </svg>
                    <span className="text-[9px] font-semibold uppercase tracking-wider">
                      Thêm ảnh
                    </span>
                  </button>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e5e7eb] px-6 py-4 bg-[#fafafa] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af] hover:text-[#1a1a1a] transition-colors disabled:opacity-40 px-1"
          >
            Hủy bỏ
          </button>

          <button
            type="submit"
            form="review-form"
            disabled={isLoading || !isValid}
            className="bg-[#1a1a1a] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                Gửi đánh giá
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
