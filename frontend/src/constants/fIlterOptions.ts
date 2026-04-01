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
  {label: "0-200.000d", value: "0-200000"},
  {label: "200.000d-300.000d", value: "200000-300000"},
  {label: "300.000d-400.000d", value: "300000-400000"},
  {label: "400.000d-500.000d", value: "400000-500000"},
  {label: ">500.000d", value: "5000000"}
]