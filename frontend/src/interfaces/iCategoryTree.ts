// Định nghĩa Type (bạn có thể import từ file interfaces của bạn)
export interface ICategoryTree {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  parentId: string | null;
  level: number;
  children?: ICategoryTree[];
}