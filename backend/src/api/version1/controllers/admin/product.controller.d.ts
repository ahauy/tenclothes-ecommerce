import { Request, Response } from "express";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";
import { IAuthRequest } from "../../../../middlewares/authen.middlewares";
export declare const getListProductAdminController: (req: Request<{}, {}, {}, IRequestQueryFilter>, res: Response) => Promise<void>;
export declare const createProductController: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const updateProductController: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const changeStatusProductController: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const changeFeaturedProductController: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const deleteProductController: (req: IAuthRequest, res: Response) => Promise<void>;
/**
 * API Khôi phục sản phẩm
 */
export declare const restoreProductController: (req: IAuthRequest, res: Response) => Promise<void>;
/**
 * API Lấy lịch sử sản phẩm
 */
export declare const getProductHistoryController: (req: IAuthRequest, res: Response) => Promise<void>;
/**
 * API Xóa hàng loạt sản phẩm
 */
export declare const batchDeleteProductsController: (req: IAuthRequest, res: Response) => Promise<void>;
/**
 * API Thay đổi trạng thái hàng loạt
 */
export declare const batchChangeStatusController: (req: IAuthRequest, res: Response) => Promise<void>;
/**
 * API Thay đổi nổi bật hàng loạt
 */
export declare const batchChangeFeaturedController: (req: IAuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=product.controller.d.ts.map