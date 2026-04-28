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

interface CategoryMenuProps {
  isMobile?: boolean;
  setVisible?: (visible: boolean) => void;
}

const CategoryMenu = ({ isMobile = false, setVisible }: CategoryMenuProps) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(null);

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

  const categoriesToRender = categoryTree.length > 0 ? categoryTree : mockCategories;

  // ==== RENDER CHO MOBILE ====
  if (isMobile) {
    return (
      <>
        {categoriesToRender.map((level1) => (
          <div key={level1._id} className="flex flex-col">
            <NavLink
              to={`/collection/${level1.slug}`}
              onClick={(e) => {
                // Nếu có danh mục con thì xổ dropdown, không thì chuyển hướng luôn
                if (level1.children && level1.children.length > 0) {
                  e.preventDefault();
                  setExpandedMobileId(expandedMobileId === level1._id ? null : level1._id);
                } else {
                  if (setVisible) setVisible(false);
                }
              }}
              className={({ isActive }) =>
                `mobile-nav-item flex items-center justify-between px-6 py-3.5 text-sm text-neutral-600 hover:text-black ${
                  isActive && (!level1.children || level1.children.length === 0)
                    ? "bg-neutral-50 text-black border-l-2 border-black"
                    : "border-l-2 border-transparent"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="font-medium tracking-wide uppercase text-xs">
                  {level1.title}
                </span>
              </div>
              
              {/* Icon mũi tên xổ xuống cho mobile */}
              {level1.children && level1.children.length > 0 && (
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedMobileId === level1._id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </NavLink>

            {/* Dropdown menu level 2 trên mobile */}
            {expandedMobileId === level1._id && level1.children && (
              <div className="flex flex-col bg-neutral-50/50 py-1">
                <NavLink
                  to={`/collection/${level1.slug}`}
                  onClick={() => setVisible && setVisible(false)}
                  className="pl-14 pr-6 py-2.5 text-xs font-semibold text-neutral-800 hover:text-black"
                >
                  Tất cả {level1.title}
                </NavLink>
                {level1.children.map((level2) => (
                  <div key={level2._id} className="flex flex-col">
                    <NavLink
                      to={`/collection/${level2.slug}`}
                      onClick={() => setVisible && setVisible(false)}
                      className="pl-14 pr-6 py-2 text-xs text-neutral-600 hover:text-black"
                    >
                      {level2.title}
                    </NavLink>
                    {/* Render level 3 (Nếu có) */}
                    {level2.children && level2.children.length > 0 && level2.children.map((level3) => (
                      <NavLink
                        key={level3._id}
                        to={`/collection/${level3.slug}`}
                        onClick={() => setVisible && setVisible(false)}
                        className="pl-16 pr-6 py-1.5 text-[11px] text-neutral-400 hover:text-black"
                      >
                        - {level3.title}
                      </NavLink>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </>
    );
  }

  // ==== RENDER CHO DESKTOP (Giữ nguyên logic MegaMenu) ====
  return (
    <>
      {categoriesToRender.map((level1) => (
        <li key={level1._id} className="group list-none cursor-pointer">
          <NavLink
            to={`/collection/${level1.slug}`}
            className="flex flex-col items-center gap-1 py-4"
          >
            <p className="uppercase hover:text-[#ff4500]">{level1.title}</p>
          </NavLink>

          {level1.children && level1.children.length > 0 && (
            <div className="absolute left-0 w-full bg-white shadow-md border-t border-gray-100 hidden group-hover:flex z-50 cursor-default">
              <div className="flex w-full max-w-300 mx-auto p-10 gap-10">
                <div className="w-1/2">
                  <h3 className="font-bold text-xl border-b pb-3 mb-6 text-black uppercase">
                    {level1.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {level1.children.map((level2) => (
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
                              <span className="px-2 text-gray-400 group-hover/level2:text-black group-hover/level2:rotate-180 transition-transform duration-300">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </span>
                            )}
                          </NavLink>
                        </div>

                        {level2.children && level2.children.length > 0 && (
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