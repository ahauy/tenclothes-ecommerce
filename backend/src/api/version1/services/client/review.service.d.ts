interface CreateReviewParams {
    userId: string;
    productId: string;
    orderId: string;
    rating: number;
    content: string;
    images?: string[] | undefined;
}
export declare const createViewProductService: ({ userId, productId, orderId, rating, content, images, }: CreateReviewParams) => Promise<import("mongoose").Document<unknown, {}, import("../../../../models/review.model").IReview, {}, import("mongoose").DefaultSchemaOptions> & import("../../../../models/review.model").IReview & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const getReviewsByProductService: (productId: string) => Promise<(import("../../../../models/review.model").IReview & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
export {};
//# sourceMappingURL=review.service.d.ts.map