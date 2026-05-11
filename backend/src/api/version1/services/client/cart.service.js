"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCartService = exports.validateLocalCartSevice = void 0;
const product_model_1 = __importDefault(require("../../../../models/product.model"));
const cart_model_1 = require("../../../../models/cart.model");
const validateLocalCartSevice = async (items) => {
    const validItems = await Promise.all(items.map(async (item) => {
        const product = await product_model_1.default.findOne({ _id: item.productId });
        if (!product)
            return null;
        // Tìm variant khớp cả Size và Màu sắc
        const variant = product.variants.find((v) => v.size === item.size && v.colorName === item.color);
        // Tìm Style để lấy đúng ảnh của màu đó
        const style = product.productStyles.find((s) => s.colorName === item.color) ||
            product.productStyles[0];
        const isOutOfStock = !variant || variant.stock < item.quantity;
        return {
            productId: product._id,
            sku: variant?.sku || item.sku, // Lấy mã SKU
            slug: product.slug,
            title: product.title,
            color: item.color, // Bổ sung màu sắc
            size: item.size,
            image: style?.images[0] || "", // Lấy ảnh đầu tiên của màu đã chọn
            quantity: item.quantity,
            price: product.price,
            salePrice: product.salePrice,
            isOutOfStock: isOutOfStock,
        };
    }));
    return validItems.filter((item) => item !== null);
};
exports.validateLocalCartSevice = validateLocalCartSevice;
const syncCartService = async (userId, localItemsCart) => {
    let cart = await cart_model_1.Cart.findOne({ userId: userId });
    if (cart === null) {
        cart = new cart_model_1.Cart({ userId, items: localItemsCart });
    }
    else {
        localItemsCart.forEach((localItem) => {
            // Phải check trùng cả ID, Size và Màu sắc
            const existingItemIndex = cart.items.findIndex((dbItem) => String(dbItem.productId) === String(localItem.productId) &&
                dbItem.size === localItem.size &&
                dbItem.color === localItem.color);
            if (existingItemIndex > -1) {
                cart.items[existingItemIndex].quantity += localItem.quantity;
            }
            else {
                cart.items.push(localItem);
            }
        });
        4;
    }
    await cart.save();
    const populatedCart = (await cart_model_1.Cart.findById(cart._id)
        .populate({
        path: "items.productId",
        select: "slug title price salePrice productStyles", // Thay media thành productStyles
    })
        .lean());
    const formattedItems = populatedCart.items
        .map((item) => {
        const product = item.productId;
        if (!product)
            return null;
        // Tìm đúng mảng ảnh của màu sắc đó
        const style = product.productStyles?.find((s) => s.colorName === item.color) ||
            product.productStyles?.[0];
        return {
            productId: product._id,
            sku: item.sku,
            slug: product.slug,
            title: product.title,
            price: product.price,
            salePrice: product.salePrice,
            color: item.color,
            size: item.size,
            image: style?.images[0] || "",
            quantity: item.quantity,
        };
    })
        .filter((item) => item !== null);
    return formattedItems;
};
exports.syncCartService = syncCartService;
//# sourceMappingURL=cart.service.js.map