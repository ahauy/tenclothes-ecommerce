import api from "../utils/axios";

export const roleService = {
  getRoles: async () => {
    const response = await api.get(`/role`);
    return response.data;
  },

  createRole: async (data: any) => {
    const response = await api.post(`/role/create`, data);
    return response.data;
  },

  updateRole: async (id: string, data: any) => {
    const response = await api.patch(`/role/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: string) => {
    const response = await api.delete(`/role/${id}`);
    return response.data;
  },

  getPermissions: async () => {
    // Mock or fetch list of all available permissions
    return [
      {
        module: "Sản phẩm",
        permissions: [
          { key: "products_view", label: "Xem sản phẩm" },
          { key: "products_create", label: "Thêm sản phẩm" },
          { key: "products_edit", label: "Sửa sản phẩm" },
          { key: "products_delete", label: "Xóa sản phẩm" },
        ],
      },
      {
        module: "Đơn hàng",
        permissions: [
          { key: "orders_view", label: "Xem đơn hàng" },
          { key: "orders_edit", label: "Cập nhật đơn hàng" },
          { key: "orders_delete", label: "Xóa đơn hàng" },
        ],
      },
      {
        module: "Khách hàng",
        permissions: [
          { key: "customers_view", label: "Xem khách hàng" },
          { key: "customers_edit", label: "Sửa khách hàng" },
          { key: "customers_delete", label: "Xóa khách hàng" },
        ],
      },
      {
        module: "Nhân sự",
        permissions: [
          { key: "staff_view", label: "Xem nhân viên" },
          { key: "staff_manage", label: "Quản lý nhân viên" },
          { key: "permissions_manage", label: "Quản lý phân quyền" },
        ],
      },
    ];
  },
};
