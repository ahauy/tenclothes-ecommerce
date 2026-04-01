export const convertPrice = (price: number | undefined): string => {
  if (!price) return "0"
  else return price.toLocaleString("vi-VN")
}