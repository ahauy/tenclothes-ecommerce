"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCart = exports.updateCart = exports.addToCart = exports.syncCart = exports.validateLocalCart = void 0;
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const cart_service_1 = require("../../services/client/cart.service");
const cart_model_1 = require("../../../../models/cart.model");
// Xác thực dữ liệu của giỏ hàng lưu trong localStorage
const validateLocalCart = async (req, res) => {
    try {
        const items = req.body.items; // Mảng [{ productId, size, quantity }]
        const finalCart = await (0, cart_service_1.validateLocalCartSevice)(items);
        res.status(200).json({ status: true, data: finalCart });
    }
    catch (error) {
        console.error("Có lỗi trong validateLocalCart: ", error);
        // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({
                status: false,
                message: error.message, // Sẽ in ra "Email đã được sử dụng!"
            });
            return;
        }
        // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
        res.status(500).json({ message: "Lỗi hệ thống!" });
    }
};
exports.validateLocalCart = validateLocalCart;
// Đồng bộ giỏ hàng khi đăng nhập
const syncCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({
                message: "Không tìm thấy thông tin người dùng!",
            });
            return;
        }
        const localItemsCart = req.body.items || [];
        const formattedItems = (0, cart_service_1.syncCartService)(userId, localItemsCart);
        res.status(200).json({
            status: true,
            message: "Đồng bộ giỏ hàng thành công!",
            data: formattedItems,
        });
    }
    catch (error) {
        console.error("Có lỗi trong syncCart: ", error);
        // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({
                status: false,
                message: error.message, // Sẽ in ra "Email đã được sử dụng!"
            });
            return;
        }
        // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
        res.status(500).json({ message: "Lỗi hệ thống!" });
    }
};
exports.syncCart = syncCart;
const addToCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { productId, sku, color, size, quantity } = req.body;
        if (!userId) {
            res.status(401).json({ message: "Chưa xác thực người dùng!" });
            return;
        }
        let cart = await cart_model_1.Cart.findOne({ userId });
        if (!cart) {
            cart = new cart_model_1.Cart({ userId, items: [{ productId, sku, color, size, quantity }] });
            await cart.save();
        }
        else {
            // Tìm theo cả 3 tham số
            const existingItemIndex = cart.items.findIndex((item) => String(item.productId) === String(productId) && item.size === size && item.color === color);
            if (existingItemIndex > -1) {
                cart.items[existingItemIndex].quantity += quantity;
            }
            else {
                cart.items.push({ productId, sku, color, size, quantity });
            }
            await cart.save();
        }
        res.status(200).json({ status: true, message: "Thêm vào giỏ thành công" });
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};
exports.addToCart = addToCart;
const updateCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { productId, color, size, quantity } = req.body;
        if (!userId) {
            res.status(401).json({ message: "Chưa xác thực người dùng!" });
            return;
        }
        const cart = await cart_model_1.Cart.findOne({ userId });
        if (!cart) {
            res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
            return;
        }
        const itemIndex = cart.items.findIndex((item) => String(item.productId) === String(productId) && item.size === size && item.color === color);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            res.status(200).json({ status: true, message: "Cập nhật thành công" });
        }
        else {
            res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};
exports.updateCart = updateCart;
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { productId, color, size } = req.body;
        if (!userId) {
            res.status(401).json({ message: "Chưa xác thực người dùng!" });
            return;
        }
        const updatedCart = await cart_model_1.Cart.findOneAndUpdate({ userId }, {
            $pull: {
                items: { productId: productId, size: size, color: color } // Xóa chính xác variant
            }
        }, { returnDocument: "after" });
        if (!updatedCart) {
            res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
            return;
        }
        res.status(200).json({ status: true, message: "Xóa sản phẩm thành công" });
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};
exports.removeFromCart = removeFromCart;
//# sourceMappingURL=cart.controller.js.map