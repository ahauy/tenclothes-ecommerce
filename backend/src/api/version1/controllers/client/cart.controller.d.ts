import { ISyncCartBody } from "../../../../interfaces/cart.interfaces";
import { Request, Response } from "express";
export declare const validateLocalCart: (req: Request<{}, {}, ISyncCartBody>, res: Response) => Promise<void>;
export declare const syncCart: (req: Request<{}, {}, ISyncCartBody>, res: Response) => Promise<void>;
interface ICartActionBody {
    productId: string;
    sku?: string;
    color: string;
    size: string;
    quantity: number;
}
export declare const addToCart: (req: Request<{}, {}, ICartActionBody>, res: Response) => Promise<void>;
export declare const updateCart: (req: Request<{}, {}, ICartActionBody>, res: Response) => Promise<void>;
interface IRemoveCartBody {
    productId: string;
    color: string;
    size: string;
}
export declare const removeFromCart: (req: Request<{}, {}, IRemoveCartBody>, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=cart.controller.d.ts.map