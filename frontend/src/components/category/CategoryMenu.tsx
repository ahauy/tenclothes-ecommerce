import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../../utils/axios";
import type { ICategoryTree } from "../../interfaces/iCategoryTree";
import { useCategoryStore } from "../../stores/useCategoryStore";

const mockCategories: ICategoryTree[] = [
  {
    _id: "69dd239a48d1d0dc956c9461",
    title: "Áo Nam",
    slug: "ao-nam",
    thumbnail: "https://picsum.photos/seed/ao-nam-root/400/400",
    parentId: null,
    level: 1,
    children: [
      {
        _id: "69dd25ba48d1d0dc956c9467",
        title: "Áo Thun Nam",
        slug: "ao-thun-nam",
        thumbnail: "https://picsum.photos/seed/aothun-nam/400/400",
        parentId: "69dd239a48d1d0dc956c9461",
        level: 2,
        children: [],
      },
      {
        _id: "69dd25ba48d1d0dc956c9468",
        title: "Áo Sơ Mi Nam",
        slug: "ao-so-mi-nam",
        thumbnail: "https://picsum.photos/seed/somi-nam/400/400",
        parentId: "69dd239a48d1d0dc956c9461",
        level: 2,
        children: [
          {
            _id: "69dd272e48d1d0dc956c9470",
            title: "Sơ Mi Cộc Tay",
            slug: "so-mi-coc-tay",
            thumbnail: "https://picsum.photos/seed/somi-coctay/400/400",
            parentId: "69dd25ba48d1d0dc956c9468",
            level: 3,
            children: [],
          },
          {
            _id: "69dd272e48d1d0dc956c9471",
            title: "Sơ Mi Dài Tay",
            slug: "so-mi-dai-tay",
            thumbnail: "https://picsum.photos/seed/somi-daitay/400/400",
            parentId: "69dd25ba48d1d0dc956c9468",
            level: 3,
            children: [],
          },
        ],
      },
      {
        _id: "69dd25ba48d1d0dc956c9469",
        title: "Áo Polo Nam",
        slug: "ao-polo-nam",
        thumbnail: "https://picsum.photos/seed/polo-nam/400/400",
        parentId: "69dd239a48d1d0dc956c9461",
        level: 2,
        children: [],
      },
      {
        _id: "69dd25ba48d1d0dc956c946a",
        title: "Áo Khoác Nam",
        slug: "ao-khoac-nam",
        thumbnail: "https://picsum.photos/seed/khoac-nam/400/400",
        parentId: "69dd239a48d1d0dc956c9461",
        level: 2,
        children: [],
      },
    ],
  },
  {
    _id: "69dd239a48d1d0dc956c9462",
    title: "Quần Nam",
    slug: "quan-nam",
    thumbnail: "https://picsum.photos/seed/quan-nam-root/400/400",
    parentId: null,
    level: 1,
    children: [
      {
        _id: "69dd25ba48d1d0dc956c946b",
        title: "Quần Jean Nam",
        slug: "quan-jean-nam",
        thumbnail: "https://picsum.photos/seed/jean-nam/400/400",
        parentId: "69dd239a48d1d0dc956c9462",
        level: 2,
        children: [],
      },
      {
        _id: "69dd25ba48d1d0dc956c946c",
        title: "Quần Tây Nam",
        slug: "quan-tay-nam",
        thumbnail: "https://picsum.photos/seed/quantay-nam/400/400",
        parentId: "69dd239a48d1d0dc956c9462",
        level: 2,
        children: [],
      },
      {
        _id: "69dd25ba48d1d0dc956c946d",
        title: "Quần Short Nam",
        slug: "quan-short-nam",
        thumbnail: "https://picsum.photos/seed/short-nam/400/400",
        parentId: "69dd239a48d1d0dc956c9462",
        level: 2,
        children: [],
      },
      {
        _id: "69dd25ba48d1d0dc956c946e",
        title: "Quần Kaki Nam",
        slug: "quan-kaki-nam",
        thumbnail: "https://picsum.photos/seed/kaki-nam/400/400",
        parentId: "69dd239a48d1d0dc956c9462",
        level: 2,
        children: [],
      },
    ],
  },
  {
    _id: "69dd239a48d1d0dc956c9463",
    title: "Phụ kiện",
    slug: "phu-kien",
    thumbnail: "https://picsum.photos/seed/phu-kien-root/400/400",
    parentId: null,
    level: 1,
    children: [],
  },
];

const CategoryMenu = () => {
  // State lưu id của danh mục level 2 đang được mở rộng (để xem level 3
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const categoryTree: ICategoryTree[] = useCategoryStore((s) => s.categoryTree);
  const setCategoryTree = useCategoryStore((s) => s.setCategoryTree);

  useEffect(() => {
    async function getCategories() {
      try {
        if (categoryTree.length > 0) {
          return;
        }

        const response = await api.get("/category/tree");
        if (response.data.status) {
          setCategoryTree(response.data.data);
        }
      } catch (error) {
        console.error("Có lỗi trong quá trình lấy danh sách danh mục: ", error);
      }
    }

    getCategories();
  }, [categoryTree.length, setCategoryTree]);

  return (
    <>
      {(categoryTree.length > 0 ? categoryTree : mockCategories).map((level1) => (
        // Dùng list-none và KHÔNG dùng relative ở đây để MegaMenu bung full width màn hình
        <li key={level1._id} className="group list-none cursor-pointer">
          {/* Menu Item Level 1 (Hiển thị trên thanh Navbar) */}
          <NavLink
            to={`/collection/${level1.slug}`}
            className="flex flex-col items-center gap-1 py-4"
          >
            <p className="uppercase hover:text-[#ff4500]">{level1.title}</p>
            {/* Thanh gạch dưới khi hover (giữ nguyên style của bạn) */}
          </NavLink>

          {/* Mega Menu Dropdown (Chỉ hiện khi hover vào level 1 có danh mục con) */}
          {level1.children && level1.children.length > 0 && (
            <div className="absolute left-0 w-full bg-white shadow-md border-t border-gray-100 hidden group-hover:flex z-50 cursor-default">
              <div className="flex w-full max-w-300 mx-auto p-10 gap-10">
                <div className="w-1/2">
                  <h3 className="font-bold text-xl border-b pb-3 mb-6 text-black uppercase">
                    {level1.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {level1.children.map((level2) => (
                      // 1. THÊM class "group/level2" VÀO THẺ BAO NGOÀI CÙNG CỦA LEVEL 2
                      <div
                        key={level2._id}
                        className="flex flex-col group/level2"
                      >
                        <div className="flex items-center justify-between">
                          <NavLink
                            to={`/collection/${level2.slug}`}
                            className="text-gray-600 hover:text-black font-medium transition-colors flex justify-between w-full"
                            onMouseEnter={() =>
                              setHoveredImage(level2.thumbnail)
                            }
                          >
                            <span>{level2.title}</span>

                            {level2.children && level2.children.length > 0 && (
                              // 2. XOAY MŨI TÊN KHI HOVER: Dùng group-hover/level2:rotate-180
                              <span className="px-2 text-gray-400 group-hover/level2:text-black group-hover/level2:rotate-180 transition-transform duration-300">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </span>
                            )}
                          </NavLink>
                        </div>

                        {level2.children && level2.children.length > 0 && (
                          // 3. HIỆN DANH MỤC CẤP 3 KHI HOVER: Đổi từ việc check state sang dùng "hidden group-hover/level2:flex"
                          <div className="hidden group-hover/level2:flex flex-col gap-2 mt-2 ml-3">
                            {level2.children.map((level3) => (
                              <NavLink
                                key={level3._id}
                                to={`/collection/${level3.slug}`}
                                className="text-sm text-gray-500 hover:text-black w-fit"
                                onMouseEnter={(e) => {
                                  e.stopPropagation();
                                  setHoveredImage(level3.thumbnail);
                                }}
                              >
                                {level3.title}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- CỘT PHẢI: ẢNH BANNER --- */}
                <div className="w-1/2 flex items-center justify-center">
                  <div className="w-full h-87.5 bg-gray-50 rounded-md overflow-hidden relative">
                    <img
                      src={
                        hoveredImage ||
                        level1.thumbnail ||
                        "https://via.placeholder.com/600x400"
                      }
                      alt="Category Preview"
                      className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </li>
      ))}
    </>
  );
};

export default CategoryMenu;
