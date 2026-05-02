export interface IRoleAdmin {
  _id: string;
  title: string;
  description?: string;
  permissions: string[]; // List of permission keys: 'products_view', 'orders_edit', etc.
  createdAt: string;
  updatedAt: string;
}

export interface IPermissionGroup {
  module: string;
  permissions: {
    key: string;
    label: string;
    description?: string;
  }[];
}
