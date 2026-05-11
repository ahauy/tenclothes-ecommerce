"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchChangeFeaturedController = exports.batchChangeStatusController = exports.batchDeleteProductsController = exports.getProductHistoryController = exports.restoreProductController = exports.deleteProductController = exports.changeFeaturedProductController = exports.changeStatusProductController = exports.updateProductController = exports.createProductController = exports.getListProductAdminController = void 0;
const product_service_1 = require("../../services/admin/product.service");
const getListProductAdminController = async (req, res) => {
    try {
        const result = await (0, product_service_1.getListProductAdminService)(req.query);
        res.status(200).json({
            status: true,
            message: "Lấy danh sách sản phẩm thành công!",
            data: result,
        });
    }
    catch (error) {
        console.error("Lỗi trong getListProductAdminController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.getListProductAdminController = getListProductAdminController;
const createProductController = async (req, res) => {
    try {
        const productData = req.body;
        const staff = req.user; // Lấy thông tin người thực hiện từ middleware
        const newProduct = await (0, product_service_1.createProductService)(productData, staff);
        res.status(201).json({
            status: true,
            message: "Tạo mới sản phẩm thành công!",
            data: {
                product: newProduct,
            },
        });
    }
    catch (error) {
        console.log("Có lỗi trong createProductController: ", error);
        if (error.code === 11000) {
            res.status(409).json({
                status: false,
                message: "Tên sản phẩm, đường dẫn (Slug) hoặc mã SKU đã tồn tại!",
            });
            return;
        }
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.createProductController = createProductController;
const updateProductController = async (req, res) => {
    try {
        const { slug } = req.params;
        const productData = req.body;
        const staff = req.user;
        const updatedProduct = await (0, product_service_1.updateProductService)(slug, productData, staff);
        if (!updatedProduct) {
            res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm!" });
            return;
        }
        res.status(200).json({
            status: true,
            message: "Cập nhật sản phẩm thành công!",
            data: { product: updatedProduct },
        });
    }
    catch (error) {
        console.log("Có lỗi trong updateProductController: ", error);
        if (error.code === 11000) {
            res.status(409).json({ status: false, message: "Mã SKU hoặc Slug đã tồn tại!" });
            return;
        }
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.updateProductController = updateProductController;
const changeStatusProductController = async (req, res) => {
    try {
        const { slug } = req.params;
        const { status } = req.body;
        const staff = req.user;
        const updatedProduct = await (0, product_service_1.changeStatusProductService)(slug, status, staff);
        if (!updatedProduct) {
            res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm!" });
            return;
        }
        res.status(200).json({
            status: true,
            message: "Cập nhật trạng thái sản phẩm thành công!",
            data: updatedProduct,
        });
    }
    catch (error) {
        console.error("Lỗi trong changeStatusProductController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.changeStatusProductController = changeStatusProductController;
const changeFeaturedProductController = async (req, res) => {
    try {
        const { slug } = req.params;
        const { isFeatured } = req.body;
        const staff = req.user;
        const updatedProduct = await (0, product_service_1.changeFeaturedProductService)(slug, isFeatured, staff);
        if (!updatedProduct) {
            res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm!" });
            return;
        }
        res.status(200).json({
            status: true,
            message: "Cập nhật sản phẩm nổi bật thành công!",
            data: updatedProduct,
        });
    }
    catch (error) {
        console.error("Lỗi trong changeFeaturedProductController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.changeFeaturedProductController = changeFeaturedProductController;
const deleteProductController = async (req, res) => {
    try {
        const { slug } = req.params;
        const staff = req.user;
        const deletedProduct = await (0, product_service_1.deleteProductService)(slug, staff);
        if (!deletedProduct) {
            res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm!" });
            return;
        }
        res.status(200).json({
            status: true,
            message: "Xóa sản phẩm thành công!",
            data: deletedProduct,
        });
    }
    catch (error) {
        console.error("Lỗi trong deleteProductController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.deleteProductController = deleteProductController;
/**
 * API Khôi phục sản phẩm
 */
const restoreProductController = async (req, res) => {
    try {
        const { slug } = req.params;
        const staff = req.user;
        const result = await (0, product_service_1.restoreProductService)(slug, staff);
        if (!result.success) {
            res.status(403).json({ status: false, message: result.message });
            return;
        }
        res.status(200).json({
            status: true,
            message: result.message,
            data: result.product,
        });
    }
    catch (error) {
        console.error("Lỗi trong restoreProductController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.restoreProductController = restoreProductController;
/**
 * API Lấy lịch sử sản phẩm
 */
const getProductHistoryController = async (req, res) => {
    try {
        const { slug } = req.params;
        const history = await (0, product_service_1.getProductHistoryService)(slug);
        res.status(200).json({
            status: true,
            message: "Lấy lịch sử sản phẩm thành công!",
            data: history,
        });
    }
    catch (error) {
        console.error("Lỗi trong getProductHistoryController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.getProductHistoryController = getProductHistoryController;
/**
 * API Xóa hàng loạt sản phẩm
 */
const batchDeleteProductsController = async (req, res) => {
    try {
        const { slugs } = req.body;
        if (!Array.isArray(slugs) || slugs.length === 0) {
            res.status(400).json({ status: false, message: "Danh sách sản phẩm không hợp lệ!" });
            return;
        }
        const staff = req.user;
        const result = await (0, product_service_1.batchDeleteProductsService)(slugs, staff);
        res.status(200).json({
            status: true,
            message: `Đã xóa ${result.deletedCount} sản phẩm thành công!`,
            data: result,
        });
    }
    catch (error) {
        console.error("Lỗi trong batchDeleteProductsController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.batchDeleteProductsController = batchDeleteProductsController;
/**
 * API Thay đổi trạng thái hàng loạt
 */
const batchChangeStatusController = async (req, res) => {
    try {
        const { slugs, status } = req.body;
        if (!Array.isArray(slugs) || slugs.length === 0) {
            res.status(400).json({ status: false, message: "Danh sách sản phẩm không hợp lệ!" });
            return;
        }
        const staff = req.user;
        const result = await (0, product_service_1.batchChangeStatusService)(slugs, status, staff);
        res.status(200).json({
            status: true,
            message: `Đã cập nhật trạng thái ${result.updatedCount} sản phẩm!`,
            data: result,
        });
    }
    catch (error) {
        console.error("Lỗi trong batchChangeStatusController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.batchChangeStatusController = batchChangeStatusController;
/**
 * API Thay đổi nổi bật hàng loạt
 */
const batchChangeFeaturedController = async (req, res) => {
    try {
        const { slugs, isFeatured } = req.body;
        if (!Array.isArray(slugs) || slugs.length === 0) {
            res.status(400).json({ status: false, message: "Danh sách sản phẩm không hợp lệ!" });
            return;
        }
        const staff = req.user;
        const result = await (0, product_service_1.batchChangeFeaturedService)(slugs, isFeatured, staff);
        res.status(200).json({
            status: true,
            message: `Đã cập nhật ${result.updatedCount} sản phẩm nổi bật!`,
            data: result,
        });
    }
    catch (error) {
        console.error("Lỗi trong batchChangeFeaturedController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.batchChangeFeaturedController = batchChangeFeaturedController;
//# sourceMappingURL=product.controller.js.map