import { useState, useRef } from "react";
import { toast } from "sonner";
import { reviewService } from "../services/reviewService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faTimes, faImage } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  orderId: string;
  onReviewSuccess: () => void;
}

const ReviewModal = ({ isOpen, onClose, productId, orderId, onReviewSuccess }: ReviewModalProps) => {
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast.error("Bạn chỉ có thể chọn tối đa 5 ảnh");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  const resetState = () => {
    setRating(5);
    setContent("");
    setImages([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 5) {
      toast.error("Nội dung đánh giá quá ngắn (ít nhất 5 ký tự)");
      return;
    }

    try {
      setIsLoading(true);
      await reviewService.createReviewService(productId, orderId, rating, content, images);
      toast.success("Đánh giá sản phẩm thành công!");
      onReviewSuccess();
      handleClose();
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? handleClose : undefined}
      ></div>
      
      {/* Modal */}
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Đánh giá sản phẩm</h2>
          <button 
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>
        
        <div className="overflow-y-auto custom-scrollbar p-6">
          <form id="review-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Rating */}
            <div className="flex flex-col items-center gap-3">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Chất lượng sản phẩm</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <FontAwesomeIcon 
                      icon={star <= rating ? faStarSolid : faStarRegular} 
                      className={`text-3xl sm:text-4xl transition-colors duration-200 ${star <= rating ? 'text-[#ffb800]' : 'text-gray-200'}`} 
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm text-[#ffb800] font-medium">
                {rating === 5 ? "Tuyệt vời" : rating === 4 ? "Rất tốt" : rating === 3 ? "Bình thường" : rating === 2 ? "Kém" : "Rất tệ"}
              </span>
            </div>

            {/* Content */}
            <div>
              <textarea
                id="content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none transition-all placeholder:text-gray-400 text-gray-700"
                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này nhé (ít nhất 5 ký tự)..."
                required
              ></textarea>
            </div>

            {/* Image Upload */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Hình ảnh thực tế <span className="text-gray-400 font-normal">(Tối đa 5 ảnh)</span></label>
                <span className="text-xs text-gray-500">{images.length}/5</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative w-20 h-20 group rounded-lg overflow-hidden border border-gray-200">
                    <img src={url} alt={`preview ${index}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-white hover:text-red-400 transition-colors p-2"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                ))}

                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    <FontAwesomeIcon icon={faImage} className="text-xl mb-1" />
                    <span className="text-[10px] font-medium">Thêm ảnh</span>
                  </button>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/jpeg, image/png, image/webp"
                  multiple
                  className="hidden"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none disabled:opacity-50"
          >
            Đóng
          </button>
          <button
            type="submit"
            form="review-form"
            disabled={isLoading || content.trim().length < 5}
            className="px-6 py-2.5 bg-black text-white rounded-xl font-medium shadow-md shadow-black/20 hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Đang tải...</span>
              </div>
            ) : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
