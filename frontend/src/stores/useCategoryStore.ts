import { create } from "zustand";
import type { ICategoryTree } from "../interfaces/iCategoryTree";

export interface CategoryTreeState {
  categoryTree: ICategoryTree[];
  setCategoryTree: (items: ICategoryTree[]) => void;
}

export const useCategoryStore = create<CategoryTreeState>()((set) => ({
  categoryTree: [],
  setCategoryTree: (items) => {
    set({categoryTree: items})
  }
}));
