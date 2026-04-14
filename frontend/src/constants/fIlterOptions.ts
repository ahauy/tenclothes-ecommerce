import type { IFilterOption } from "../interfaces/iFilterOption";

export const FIT_OPTIONS: IFilterOption[] = [
  { label: "Mặc hàng ngày", value: "daily" },
  { label: "Mặc ở nhà", value: "home" },
  { label: "Thể thao", value: "sport" },
];

export const SIZE_OPTIONS: IFilterOption[] = [
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "XXL", value: "XXL" },
];

export const PRICE_OPTIONS: IFilterOption[] = [
  { label: "0-200.000d", value: "0-200000" },
  { label: "200.000d-300.000d", value: "200000-300000" },
  { label: "300.000d-400.000d", value: "300000-400000" },
  { label: "400.000d-500.000d", value: "400000-500000" },
  { label: ">500.000d", value: "5000000" },
];

export const COLOR_OPTIONS = [
  { label: "Cam", value: "orange", hexCode: "#f97316" },
  { label: "Đỏ", value: "red", hexCode: "#ef4444" },
  { label: "Đỏ Đô", value: "darkred", hexCode: "#8b0000" },
  { label: "Ghi", value: "gray", hexCode: "#808080" },
  { label: "Ghi Đậm", value: "darkgray", hexCode: "#4b5563" },
  { label: "Ghi Nhạt", value: "lightgray", hexCode: "#d1d5db" },
  { label: "Tím Than", value: "navy", hexCode: "#1e3a8a" },
  { label: "Trắng Kem", value: "cream", hexCode: "#fef3c7" },
  { label: "Vàng", value: "yellow", hexCode: "#eab308" },
  { label: "Xanh Lá", value: "green", hexCode: "#22c55e" },
  { label: "Be", value: "beige", hexCode: "#f5f5dc" },
  { label: "Đen", value: "black", hexCode: "#000000" },
  { label: "Hồng", value: "pink", hexCode: "#f472b6" },
  { label: "Nâu", value: "brown", hexCode: "#8b4513" },
  { label: "Rêu", value: "moss", hexCode: "#4d7c0f" },
  { label: "Trắng", value: "white", hexCode: "#ffffff" },
  { label: "Xanh", value: "blue", hexCode: "#3b82f6" },
];
