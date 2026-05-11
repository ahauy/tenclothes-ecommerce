"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationRole = void 0;
const authorizationRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const role = req.user?.role;
            if (!role) {
                res
                    .status(403)
                    .json({ message: "Bạn chưa được cấp quyền cho chức năng trên!" });
                return;
            }
            if (role.includes("admin")) {
                next();
                return;
            }
            if (allowedRoles.includes(role)) {
                next();
                return;
            }
            else {
                res
                    .status(403)
                    .json({ message: "Bạn chưa được cấp quyền cho chức năng trên!" });
                return;
            }
        }
        catch (error) {
            res.status(500).json({ message: "Lỗi hệ thống kiểm tra phân quyền!" });
        }
    };
};
exports.authorizationRole = authorizationRole;
//# sourceMappingURL=authorize.middlewares.js.map