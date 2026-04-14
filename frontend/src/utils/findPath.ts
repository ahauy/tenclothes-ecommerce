import type { ICategoryTree } from "../interfaces/iCategoryTree";

export const findPath = (
  tree: ICategoryTree[],
  targetSlug: string,
  currentPath: ICategoryTree[] = []
): ICategoryTree[] | null => {
  for (const node of tree) {
    const path = [...currentPath, node];
    if (node.slug === targetSlug) return path;
    if (node.children && node.children.length > 0) {
      const found = findPath(node.children, targetSlug, path);
      if (found) return found;
    }
  }
  return null;
};