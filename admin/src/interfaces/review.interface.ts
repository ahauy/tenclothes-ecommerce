export interface IReviewUser {
  _id: string;
  fullName: string;
  avatar?: string;
  email: string;
  strikeCount?: number;
  isActive?: boolean;
}

export interface IReviewProduct {
  _id: string;
  title: string;
  thumbnail?: string;
}

export interface IReviewAdmin {
  _id: string;
  userId: IReviewUser | null;
  productId: IReviewProduct | null;
  orderId: string;
  rating: number;
  content: string;
  images: string[];
  variantInfo: {
    color: string;
    size: string;
  };
  adminReply?: string | null;
  isHelpfulCount: number;
  status: "pending" | "approved" | "rejected";
  aiStatus: "approved" | "flagged" | "rejected";
  aiReason?: string | null;
  isStruck?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IReviewResponse {
  status: boolean;
  message: string;
  data: {
    reviews: IReviewAdmin[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}
