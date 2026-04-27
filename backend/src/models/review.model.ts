import mongoose, { Schema, Document } from "mongoose";
import Product from "./product.model"; // Import model Product của bạn

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  rating: number;
  content: string;
  images: string[];
  variantInfo: {
    color: string;
    size: string;
  };
  adminReply?: string;
  isHelpfulCount: number; // lượt thích của đánh giá đó
  status: "pending" | "approved" | "rejected"; // Thêm trạng thái duyệt
}

// 1. Thêm interface cho Model để TypeScript nhận diện được static method
export interface IReviewModel extends mongoose.Model<IReview> {
  calcAverageRatings(productId: mongoose.Types.ObjectId): Promise<void>;
}

// 2. Truyền IReviewModel vào generic của Schema
const reviewSchema = new Schema<IReview, IReviewModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    }, //  số sao mà người dùng vote cho sản phẩm
    content: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String, // URL ảnh khách hàng upload
      },
    ],
    // Lưu lại thông tin phân loại hàng khách đã mua (lấy từ Order)
    variantInfo: {
      color: { type: String, default: "" },
      size: { type: String, default: "" },
    },
    adminReply: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // Mặc định cho hiện luôn, admin có thể ẩn đi sau nếu vi phạm
    },
    isHelpfulCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// RẤT QUAN TRỌNG: Đảm bảo 1 User chỉ được đánh giá 1 lần cho 1 Sản phẩm trong 1 Đơn hàng
reviewSchema.index({ userId: 1, productId: 1, orderId: 1 }, { unique: true });

// TỐI ƯU HIỆU SUẤT ĐỌC: Đánh index để Query danh sách review của 1 sản phẩm nhanh nhất (sắp xếp mới nhất)
reviewSchema.index({ productId: 1, createdAt: -1 });
// Đánh index để Admin dễ dàng lọc các review đang chờ duyệt hoặc vi phạm
reviewSchema.index({ status: 1 });

// Static method để tính toán lại rating trung bình và tổng số review
reviewSchema.statics["calcAverageRatings"] = async function (productId) {
  const stats = await this.aggregate([
    {
      // CHỈ TÍNH TOÁN CÁC ĐÁNH GIÁ HỢP LỆ (Approved)
      $match: { productId, status: "approved" },
    },
    {
      $group: {
        _id: "$productId",
        nRating: { $sum: 1 }, // Đếm tổng số review
        avgRating: { $avg: "$rating" }, // Tính trung bình cộng của field rating
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      reviewCount: stats[0].nRating,
      averageRating: Math.round(stats[0].avgRating * 10) / 10, // Làm tròn 1 chữ số thập phân (vd: 4.5)
    });
  } else {
    // Nếu bị xóa hết review
    await Product.findByIdAndUpdate(productId, {
      reviewCount: 0,
      averageRating: 0,
    });
  }
};

// Middleware chạy sau khi LƯU (Create/Update) 1 review mới
reviewSchema.post("save", function () {
  // 3. Ép kiểu this.constructor về IReviewModel để TS nhận diện hàm
  (this.constructor as IReviewModel).calcAverageRatings(this.productId);
});

// Middleware chạy TRƯỚC KHI XÓA (Delete) 1 review để lấy productId
// 4. Khai báo kiểu cho biến next là Callback của Mongoose
reviewSchema.pre(/^findOneAnd/, async function (this: mongoose.Query<any, any>) {
  // Ép kiểu this sang any để TypeScript cho phép gán thuộc tính custom 'r'
  (this as any).r = await this.clone().findOne();
});

// Middleware chạy SAU KHI XÓA để tính lại toán
reviewSchema.post(/^findOneAnd/, async function (this: any) {
  if (this.r) {
    // Gọi hàm static để tính toán lại rating
    await (this.r.constructor as IReviewModel).calcAverageRatings(this.r.productId);
  }
});

// 6. Cập nhật export model với IReviewModel
const Review = mongoose.model<IReview, IReviewModel>("Review", reviewSchema, "reviews");

export default Review;