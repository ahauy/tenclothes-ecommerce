import { IProduct } from "./../../../../interfaces/model.interfaces";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";
import mongoose from "mongoose";
import { IProductResponse } from "../../../../interfaces/response.interface";
export declare const getListProductService: (queryFilter: IRequestQueryFilter, categorySlug?: string) => Promise<IProductResponse>;
export declare const getProductDetailService: (slug: string) => Promise<IProduct | null>;
export declare const getCategoryFilterService: (categorySlug: string) => Promise<{
    sizes: {
        label: string;
        value: string;
    }[];
    colors: {
        label: string;
        value: string;
        hexCode: string;
    }[];
}>;
export declare const getLatestCollectionService: (limit: number) => Promise<(IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare const getBestSellingService: (limit: number) => Promise<(IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare const getRelatedProductsService: (slug: string, limit: number) => Promise<(mongoose.Document<unknown, {}, IProduct, {}, mongoose.DefaultSchemaOptions> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
export declare const searchProductService: (keyword: string, limit?: number) => Promise<any[]>;
export declare const searchProductFilterService: (keyword?: string) => Promise<any>;
//# sourceMappingURL=product.service.d.ts.map