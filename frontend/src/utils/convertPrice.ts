export const convertPrice = (price: number | undefined): string => {
  if (!price || price <= 0) return ""
  return price.toLocaleString("vi-VN")
}