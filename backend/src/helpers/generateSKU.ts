// 1. Hàm phụ: Loại bỏ dấu tiếng Việt và các ký tự đặc biệt
const removeVietnameseTones = (str: string): string => {
  let result = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  result = result.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  result = result.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  result = result.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  result = result.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  result = result.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  result = result.replace(/đ/g, "d");
  result = result.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  result = result.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  result = result.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  result = result.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  result = result.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  result = result.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  result = result.replace(/Đ/g, "D");

  // Xóa các ký tự không phải chữ cái và số (chỉ giữ lại chữ, số và khoảng trắng)
  result = result.replace(/[^a-zA-Z0-9 ]/g, "");
  return result.trim();
};

// 2. Hàm phụ: Lấy các chữ cái đầu của tên sản phẩm làm Prefix
// Ví dụ: "Áo Thun Nam Basic" -> "ATNB"
const generatePrefixFromName = (name: string): string => {
  const cleanName = removeVietnameseTones(name);
  const words = cleanName.split(" ");
  // Lấy chữ cái đầu tiên của mỗi từ, viết hoa, giới hạn tối đa 5 ký tự
  const prefix = words.map((word) => word.charAt(0).toUpperCase()).join("");
  return prefix.substring(0, 5);
};

// 3. HÀM CHÍNH: Generate SKU
export const generateSKU = (
  productTitle: string,
  colorName: string,
  size: string,
  index?: number // Tùy chọn: Truyền index vào nếu muốn phân biệt các áo trùng mọi thông số
): string => {
  // Bước 1: Tạo tiền tố từ tên sản phẩm
  const prefix = generatePrefixFromName(productTitle); // VD: "ATNB"

  // Bước 2: Chuẩn hóa tên màu (Bỏ dấu, viết liền, viết hoa)
  // VD: "Xanh Navy" -> "XANHNAVY", "Đỏ đô" -> "DODO"
  const cleanColor = removeVietnameseTones(colorName)
    .replace(/\s+/g, "")
    .toUpperCase();

  // Bước 3: Chuẩn hóa Size
  const cleanSize = size.replace(/\s+/g, "").toUpperCase();

  // Bước 4: Ghép lại thành SKU cơ bản
  let sku = `${prefix}-${cleanColor}-${cleanSize}`;

  // Bước 5 (Tùy chọn): Nếu bạn muốn chắc chắn 100% unique khi tạo hàng loạt, thêm index vào đuôi
  if (index !== undefined) {
    // format index thành 2 chữ số: 1 -> 01, 2 -> 02
    sku += `-${index.toString().padStart(2, "0")}`;
  }

  return sku;
};
