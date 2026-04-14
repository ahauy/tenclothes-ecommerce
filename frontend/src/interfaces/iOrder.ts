// Định nghĩa Type dựa trên Model Backend của bạn
export interface IOrderProductItem {
  productId: string;
  sku: string; // Thêm mã kho để quản lý thực tế
  slug: string;
  title: string;
  price: number;
  salePrice: number;
  color: string; // Thêm màu sắc
  size: string;
  image: string;
  quantity: number;
  isOutOfStock?: boolean;
}

export interface IOrder {
  orderCode: string;
  totalAmount: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    detailAddress: string;
    ward: string;
    district: string;
    province: string;
    paymentMethod: string;
  };
  items: IOrderProductItem[]
}
