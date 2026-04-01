import type { IProduct } from "../assets/assets";

export interface IShopState {
  products: IProduct[];
  currency: string;
  delivery_fee: number;
  openModal: boolean;
  setOpenModal: (isOpen: boolean) => void;
}