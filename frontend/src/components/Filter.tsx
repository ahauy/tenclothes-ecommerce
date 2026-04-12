import { PRICE_OPTIONS, SIZE_OPTIONS } from "../constants/fIlterOptions"
import FilterItem from "./FilterItem";

const Filter = ({ totalProducts }: {totalProducts: number}) => {
  return (
    <div className="min-w-30 sticky top-25 self-start max-h-[calc(100vh-40px)] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between">
        <p className="my-2 text-xl flex items-center cursor-pointer gap-2">
          FILTER
        </p>
        <p className="text-gray-500">{totalProducts} results</p>
      </div>
      <div className="w-full h-px bg-gray-400"></div>
      {/* <FilterItem title="Phù hợp với" paramKey="fit" options={FIT_OPTIONS} /> */}
      <FilterItem title="Kích thước" paramKey="size" options={SIZE_OPTIONS} />
      <FilterItem title="Giá" paramKey="price_range" options={PRICE_OPTIONS} />
    </div>
  );
};

export default Filter;
