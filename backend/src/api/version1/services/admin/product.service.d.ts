import mongoose from "mongoose";
import { IProduct } from "../../../../interfaces/model.interfaces";
import { ICreateProductReqBody } from "../../validators/admin/product.validator";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";
import { IStaffReq } from "../../../../helpers/writeProductLog";
export declare const createProductService: (productData: ICreateProductReqBody, staff: IStaffReq) => Promise<IProduct>;
export declare const updateProductService: (slugKey: string, productData: ICreateProductReqBody, staff: IStaffReq) => Promise<IProduct | null>;
export declare const changeStatusProductService: (slug: string, status: boolean, staff: IStaffReq) => Promise<IProduct | null>;
export declare const changeFeaturedProductService: (slug: string, isFeatured: boolean, staff: IStaffReq) => Promise<IProduct | null>;
export declare const deleteProductService: (slugKey: string, staff: IStaffReq) => Promise<IProduct | null>;
/**
 * Khôi phục sản phẩm đã xóa
 * Phân quyền: Chỉ Admin hoặc Người đã xóa mới có thể khôi phục
 */
export declare const restoreProductService: (slugKey: string, staff: IStaffReq) => Promise<{
    success: boolean;
    message: string;
    product?: IProduct;
}>;
export declare const getProductHistoryService: (slugKey: string) => Promise<(import("../../../../interfaces/model.interfaces").IProductLog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
/**
 * Xóa hàng loạt sản phẩm (soft delete)
 */
export declare const batchDeleteProductsService: (slugs: string[], staff: IStaffReq) => Promise<{
    deletedCount: number;
}>;
/**
 * Thay đổi trạng thái hàng loạt
 */
export declare const batchChangeStatusService: (slugs: string[], status: boolean, staff: IStaffReq) => Promise<{
    updatedCount: number;
}>;
/**
 * Thay đổi nổi bật hàng loạt
 */
export declare const batchChangeFeaturedService: (slugs: string[], isFeatured: boolean, staff: IStaffReq) => Promise<{
    updatedCount: number;
}>;
export declare const getListProductAdminService: (queryFilter: IRequestQueryFilter) => Promise<{
    products: any;
    currentPage: number;
    totalPages: number;
    totalProducts: any;
}>;
//# sourceMappingURL=product.service.d.ts.map