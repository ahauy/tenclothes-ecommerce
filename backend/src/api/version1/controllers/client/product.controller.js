"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProducts = exports.getRelatedProducts = exports.getBestSelling = exports.getLatestCollection = exports.getCategoryFilters = exports.getProductDetail = exports.getListProduct = void 0;
const product_service_1 = require("../../services/client/product.service");
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const getListProduct = async (req, res) => {
    try {
        const queryFilter = req.query;
        const slug = req.params.slug;
        const { products, currentPage, totalPages, totalProducts } = await (0, product_service_1.getListProductService)(queryFilter, slug);
        res.status(200).json({
            status: true,
            message: "Lấy danh sách sản phẩm thành công!",
            data: {
                products,
                currentPage,
                totalPages,
                totalProducts,
            },
        });
        return;
    }
    catch (error) {
        console.error("Có lỗi trong getListProduct: ", error);
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
exports.getListProduct = getListProduct;
const getProductDetail = async (req, res) => {
    try {
        const slug = req.params.slug;
        const data = await (0, product_service_1.getProductDetailService)(slug);
        if (!data) {
            res.status(404).json({
                status: false,
                message: "Không thể tìm thấy sản phẩm!",
                data: null,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: "Lấy sản phẩm thành công!",
            data: {
                product: data,
            },
        });
    }
    catch (error) {
        console.error("Có lỗi trong getProductDetail: ", error);
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
exports.getProductDetail = getProductDetail;
const getCategoryFilters = async (req, res) => {
    try {
        const slug = req.params.slug;
        const keyword = req.query.keyword;
        let dynamicFilters;
        if (keyword) {
            dynamicFilters = await (0, product_service_1.searchProductFilterService)(keyword);
        }
        else {
            dynamicFilters = await (0, product_service_1.getCategoryFilterService)(slug);
        }
        res.status(200).json({
            status: true,
            message: "Lấy bộ lọc động thành công!",
            data: dynamicFilters,
        });
    }
    catch (error) {
        console.error("Có lỗi trong getCategoryFilters: ", error);
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
exports.getCategoryFilters = getCategoryFilters;
const getLatestCollection = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const data = await (0, product_service_1.getLatestCollectionService)(limit);
        res.status(200).json({
            status: true,
            message: "Lấy danh sách sản phẩm mới nhất thành công!",
            data: data,
        });
    }
    catch (error) {
        console.error("Có lỗi trong getLatestCollection: ", error);
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
exports.getLatestCollection = getLatestCollection;
const getBestSelling = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const data = await (0, product_service_1.getBestSellingService)(limit);
        res.status(200).json({
            status: true,
            message: "Lấy danh sách sản phẩm bán chạy nhất thành công!",
            data: data,
        });
    }
    catch (error) {
        console.error("Có lỗi trong getBestSelling: ", error);
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
exports.getBestSelling = getBestSelling;
const getRelatedProducts = async (req, res) => {
    try {
        const slug = req.query.slug;
        const limit = Number(req.query.limit) || 10;
        const data = await (0, product_service_1.getRelatedProductsService)(slug, limit);
        res.status(200).json({
            status: true,
            message: "Lấy danh sách sản phẩm bán chạy nhất thành công!",
            data: data,
        });
    }
    catch (error) {
        console.error("Có lỗi trong getRelatedProducts: ", error);
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
exports.getRelatedProducts = getRelatedProducts;
const searchProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const limit = Number(req.query.limit) || 10;
        if (!keyword) {
            res.status(200).json({ status: true, data: [] });
            return;
        }
        const searchResults = await (0, product_service_1.searchProductService)(keyword, limit);
        res.status(200).json({
            status: true,
            message: "Tìm kiếm thành công",
            data: searchResults,
        });
    }
    catch (error) {
        console.error("Có lỗi trong searchProducts: ", error);
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
exports.searchProducts = searchProducts;
//# sourceMappingURL=product.controller.js.map