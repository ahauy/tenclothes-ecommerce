import { Request, Response } from "express";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";
export declare const getListProduct: (req: Request<{
    slug?: string;
}, {}, {}, IRequestQueryFilter>, res: Response) => Promise<void>;
export declare const getProductDetail: (req: Request<{
    slug: string;
}>, res: Response) => Promise<void>;
export declare const getCategoryFilters: (req: Request<{
    slug: string;
}, {}, {}, {
    keyword?: string;
}>, res: Response) => Promise<void>;
export declare const getLatestCollection: (req: Request<{}, {}, {}, {
    limit?: string;
}>, res: Response) => Promise<void>;
export declare const getBestSelling: (req: Request<{}, {}, {}, {
    limit?: string;
}>, res: Response) => Promise<void>;
export declare const getRelatedProducts: (req: Request<{}, {}, {}, {
    slug: string;
    limit: string;
}>, res: Response) => Promise<void>;
export declare const searchProducts: (req: Request<{}, {}, {}, {
    keyword: string;
    limit?: string;
}>, res: Response) => Promise<void>;
//# sourceMappingURL=product.controller.d.ts.map