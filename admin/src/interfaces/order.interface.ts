export interface IOrderProductItem {
  productId: string;
  sku: string;
  slug: string;
  title: string;
  price: number;
  salePrice: number;
  color: string;
  size: string;
  image: string;
  quantity: number;
}

export interface IOrderAdmin {
  _id: string;
  userId?: string;
  orderCode: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    detailAddress: string;
    note?: string;
    paymentMethod: "cod" | "banking" | "momo";
  };
  items: IOrderProductItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode?: string;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  createdAt: string;
  updatedAt: string;
}

export interface IOrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalItems: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  paidRevenue: number;
  unpaidRevenue: number;
  paidOrders: number;
  completionRate: number;
  cancellationRate: number;
  paymentRate: number;
  todayOrders: number;
  todayRevenue: number;
}
