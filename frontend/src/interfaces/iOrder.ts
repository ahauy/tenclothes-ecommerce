// Định nghĩa Type dựa trên Model Backend của bạn
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
  items: {
    productId: string;
    title: string;
    image: string;
    size: string;
    quantity: number;
    price: number;
    salePrice: number;
  }[];
}