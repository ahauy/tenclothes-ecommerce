import mongoose, { Document } from "mongoose";
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
    isHelpfulCount: number;
    status: "pending" | "approved" | "rejected";
}
export interface IReviewModel extends mongoose.Model<IReview> {
    calcAverageRatings(productId: mongoose.Types.ObjectId): Promise<void>;
}
declare const Review: IReviewModel;
export default Review;
//# sourceMappingURL=review.model.d.ts.map