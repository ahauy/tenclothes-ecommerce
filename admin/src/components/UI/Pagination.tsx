import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded-md hover:bg-neutral-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-neutral-600" />
      </button>

      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <div key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center">
              <MoreHorizontal className="w-4 h-4 text-neutral-400" />
            </div>
          );
        }
        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-md text-[11px] font-semibold transition-all",
              currentPage === page
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
            )}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-md hover:bg-neutral-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
      >
        <ChevronRight className="w-4 h-4 text-neutral-600" />
      </button>
    </div>
  );
};

export default Pagination;
