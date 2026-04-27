import { useEffect, useState, useMemo } from "react";
import { reviewService } from "../services/reviewService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faSearch, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  reviewCount: number;
}

const ProductReviews = ({ productId, averageRating, reviewCount }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilters, setRatingFilters] = useState<number[]>([]);
  const [hasImagesOnly, setHasImagesOnly] = useState(false);
  const [hasReplyOnly, setHasReplyOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const res = await reviewService.getReviewsByProduct(productId);
        setReviews(res.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const toggleRatingFilter = (rating: number) => {
    if (ratingFilters.includes(rating)) {
      setRatingFilters(ratingFilters.filter(r => r !== rating));
    } else {
      setRatingFilters([...ratingFilters, rating]);
    }
  };

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(r => r.content.toLowerCase().includes(query));
    }

    // Rating
    if (ratingFilters.length > 0) {
      result = result.filter(r => ratingFilters.includes(r.rating));
    }

    // Has Images
    if (hasImagesOnly) {
      result = result.filter(r => r.images && r.images.length > 0);
    }

    // Has Reply
    if (hasReplyOnly) {
      result = result.filter(r => !!r.adminReply);
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return result;
  }, [reviews, searchQuery, ratingFilters, hasImagesOnly, hasReplyOnly, sortBy]);

  // UI Components
  const renderStars = (rating: number, sizeClass = "text-xs") => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon 
            key={star} 
            icon={star <= rating ? faStarSolid : faStarRegular} 
            className={`${sizeClass} ${star <= rating ? 'text-[#ffb800]' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  if (isLoading) return <div className="py-20 text-center">Đang tải đánh giá...</div>;

  return (
    <div className="mx-auto px-4 sm:px-6 py-8 font-sans animate-fadeIn">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-start gap-8 mb-12">
        <div className="md:w-1/4">
          <h2 className="text-3xl font-bold text-gray-900 uppercase leading-tight">Đánh giá<br/>sản phẩm</h2>
        </div>
        
        <div className="md:w-1/2 flex items-center gap-4">
          <span className="text-6xl font-bold text-black tracking-tighter">{averageRating}</span>
          <div className="flex flex-col gap-1">
            {renderStars(Math.round(averageRating), "text-xl")}
            <span className="text-sm text-gray-500 mt-1">Dựa trên {reviewCount} đánh giá đến từ khách hàng</span>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* LEFT SIDEBAR (FILTERS) */}
        <div className="md:w-1/4 flex flex-col gap-8">
          
          {/* Lọc đánh giá */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Lọc đánh giá</h3>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input 
                type="text" 
                placeholder="Tìm kiếm đánh giá" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-black text-sm transition-colors"
              />
            </div>
          </div>

          {/* Phân loại xếp hạng */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Phân loại xếp hạng</h3>
            <div className="flex flex-col gap-2.5">
              {[5, 4, 3, 2, 1].map((star) => (
                <label key={star} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleRatingFilter(star)}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${ratingFilters.includes(star) ? 'bg-black border-black text-white' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                    {ratingFilters.includes(star) && <FontAwesomeIcon icon={faCheck} className="text-xs" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 w-2">{star}</span>
                    {renderStars(star, "text-sm")}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Lọc phản hồi */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Lọc phản hồi</h3>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setHasReplyOnly(!hasReplyOnly)}>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${hasReplyOnly ? 'bg-black border-black text-white' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                  {hasReplyOnly && <FontAwesomeIcon icon={faCheck} className="text-xs" />}
                </div>
                <span className="text-sm text-gray-700">Đã phản hồi</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setHasImagesOnly(!hasImagesOnly)}>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${hasImagesOnly ? 'bg-black border-black text-white' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                  {hasImagesOnly && <FontAwesomeIcon icon={faCheck} className="text-xs" />}
                </div>
                <span className="text-sm text-gray-700">Có hình ảnh</span>
              </label>
            </div>
          </div>
          
        </div>

        {/* RIGHT SIDE (REVIEW LIST) */}
        <div className="md:w-3/4">
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500">Hiển thị đánh giá 1-{filteredReviews.length}</span>
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-8 py-2 rounded-full border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:border-black appearance-none cursor-pointer hover:border-gray-400 transition-colors"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
                ▼
              </div>
            </div>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center text-gray-500 shadow-sm border border-gray-100">
              Không tìm thấy đánh giá nào phù hợp với điều kiện lọc.
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {filteredReviews.map((review, index) => (
                <div key={index} className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h4 className="font-bold text-gray-900 text-lg">{review.userId?.fullName || "Người dùng ẩn danh"}</h4>
                    <span className="text-gray-400 text-sm">·</span>
                    <span className="text-gray-400 text-sm">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN", { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    {renderStars(review.rating, "text-lg")}
                  </div>

                  {(review.variantInfo?.size || review.variantInfo?.color) && (
                    <div className="flex flex-wrap items-center gap-6 mb-3 text-sm text-gray-500 font-medium">
                      {review.variantInfo.size && (
                        <span>Kích thước: <span className="text-gray-900">{review.variantInfo.size}</span></span>
                      )}
                      {review.variantInfo.color && (
                        <span>Màu sắc: <span className="text-gray-900">{review.variantInfo.color}</span></span>
                      )}
                    </div>
                  )}

                  <p className="text-gray-800 leading-relaxed mb-5 mt-3">
                    {review.content}
                  </p>
                  
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {review.images.map((img: string, i: number) => (
                        <img 
                          key={i} 
                          src={img} 
                          alt="review image" 
                          className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity shadow-sm" 
                          onClick={() => window.open(img, '_blank')}
                        />
                      ))}
                    </div>
                  )}
                  
                  {review.adminReply && (
                    <div className="mt-6 bg-gray-50 p-5 rounded-xl border border-gray-100 relative">
                      <div className="absolute top-0 left-6 w-4 h-4 bg-gray-50 border-t border-l border-gray-100 transform -translate-y-1/2 rotate-45"></div>
                      <p className="font-bold text-sm text-gray-900 mb-2">Phản hồi từ Người Bán</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{review.adminReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
