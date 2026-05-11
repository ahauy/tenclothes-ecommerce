"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const product_model_1 = __importDefault(require("./product.model")); // Import model Product của bạn
// 2. Truyền IReviewModel vào generic của Schema
const reviewSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
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
        await product_model_1.default.findByIdAndUpdate(productId, {
            reviewCount: stats[0].nRating,
            averageRating: Math.round(stats[0].avgRating * 10) / 10, // Làm tròn 1 chữ số thập phân (vd: 4.5)
        });
    }
    else {
        // Nếu bị xóa hết review
        await product_model_1.default.findByIdAndUpdate(productId, {
            reviewCount: 0,
            averageRating: 0,
        });
    }
};
// Middleware chạy sau khi LƯU (Create/Update) 1 review mới
reviewSchema.post("save", function () {
    // 3. Ép kiểu this.constructor về IReviewModel để TS nhận diện hàm
    this.constructor.calcAverageRatings(this.productId);
});
// Middleware chạy TRƯỚC KHI XÓA (Delete) 1 review để lấy productId
// 4. Khai báo kiểu cho biến next là Callback của Mongoose
reviewSchema.pre(/^findOneAnd/, async function () {
    // Ép kiểu this sang any để TypeScript cho phép gán thuộc tính custom 'r'
    this.r = await this.clone().findOne();
});
// Middleware chạy SAU KHI XÓA để tính lại toán
reviewSchema.post(/^findOneAnd/, async function () {
    if (this.r) {
        // Gọi hàm static để tính toán lại rating
        await this.r.constructor.calcAverageRatings(this.r.productId);
    }
});
// 6. Cập nhật export model với IReviewModel
const Review = mongoose_1.default.model("Review", reviewSchema, "reviews");
exports.default = Review;
//# sourceMappingURL=review.model.js.map