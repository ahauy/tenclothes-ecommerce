import { ICartItem, IOrderProductItem } from "../../../../interfaces/model.interfaces";
import { IFormattedCart } from "../../../../interfaces/cart.interfaces";
export declare const validateLocalCartSevice: (items: ICartItem[]) => Promise<IOrderProductItem[]>;
export declare const syncCartService: (userId: string, localItemsCart: ICartItem[]) => Promise<IFormattedCart[]>;
//# sourceMappingURL=cart.service.d.ts.map