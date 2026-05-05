export interface IRequestQueryFilter {
  sort?: string;
  color?: string;
  size?: string;
  price_range?: string;
  fit?: string;
  page?: string;
  limit?: string;
  keyword?: string;
  isActive?: string;
  isFeatured?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: string;
  maxPrice?: string;
  minStock?: string;
  maxStock?: string;
  isTrash?: string;
  orderStatus?: string;
  paymentStatus?: string;
}