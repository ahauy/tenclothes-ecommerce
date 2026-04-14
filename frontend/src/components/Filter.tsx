import FilterItem from "./FilterItem";
import ColorFilterItem from "./ColorFilterItem"; // Import component mới
import { PRICE_OPTIONS } from "../constants/fIlterOptions";
import type { IDynamicFilters } from "../interfaces/iDynamicFilters";

const Filter = ({
  totalProducts,
  dynamicFilters,
}: {
  totalProducts: number;
  dynamicFilters: IDynamicFilters;
}) => {
  return (
    <div className="min-w-20 sm:min-w-30 sticky top-25 self-start max-h-[calc(100vh-40px)] overflow-y-auto custom-scrollbar pr-2">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-gray-800">BỘ LỌC:</p>
        <p className="text-sm text-gray-500">{totalProducts} kết quả</p>
      </div>

      {/* Kích cỡ - Chỉ hiện khi có size thực tế */}
      {dynamicFilters?.sizes && dynamicFilters.sizes.length > 0 && (
        <FilterItem
          title="Kích cỡ"
          paramKey="size"
          options={dynamicFilters.sizes}
        />
      )}

      {/* Màu sắc - Chỉ hiện khi có màu sắc thực tế */}
      {dynamicFilters?.colors && dynamicFilters.colors.length > 0 && (
        <ColorFilterItem
          title="Màu sắc"
          paramKey="color"
          options={dynamicFilters.colors}
        />
      )}

      {/* Giá */}
      <FilterItem
        title="Khoảng giá"
        paramKey="price_range"
        options={PRICE_OPTIONS}
      />
    </div>
  );
};

export default Filter;
