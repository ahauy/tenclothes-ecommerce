import { IProduct } from "./model.interfaces";

export interface IProductResponse {
  products: IProduct[];
  totalPages: number;
  totalProducts: number;
  currentPage: number;
}