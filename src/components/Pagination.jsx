import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';

/**
 * Reusable, multi-theme Pagination Component for ACES CMS.
 * Adheres strictly to design tokens (btn-primary, btn-secondary, glass-panel).
 */
export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange = () => {},
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  itemLabel = 'records',
  className = '',
}) {
  if (totalItems === 0 && totalPages <= 1) {
    return null;
  }

  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis window
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      const leftBound = Math.max(2, safeCurrentPage - 1);
      const rightBound = Math.min(totalPages - 1, safeCurrentPage + 1);

      if (leftBound > 2) {
        pages.push('ellipsis-left');
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }

      if (rightBound < totalPages - 1) {
        pages.push('ellipsis-right');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== safeCurrentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 glass-panel rounded-2xl border border-slate-200 dark:border-white/10 text-black dark:text-white ${className}`}>
      
      {/* 1. Records Range & Page Size Selector */}
      <div className="flex flex-wrap items-center gap-3 text-xs leading-4 font-bold text-black dark:text-white">
        <span>
          Showing <span className="font-black text-indigo-600 dark:text-indigo-400">{startItem}</span> to{' '}
          <span className="font-black text-indigo-600 dark:text-indigo-400">{endItem}</span> of{' '}
          <span className="font-black text-indigo-600 dark:text-indigo-400">{totalItems}</span> {itemLabel}
        </span>

        {onPageSizeChange && pageSizeOptions && pageSizeOptions.length > 0 && (
          <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200 dark:border-white/10">
            <span className="opacity-80">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-transparent rounded-lg px-2 py-1 text-xs font-black text-black dark:text-white border border-slate-300 dark:border-white/20 focus:outline-none focus:border-indigo-500 cursor-pointer"
              aria-label="Select records per page"
            >
              {pageSizeOptions.map((opt) => (
                <option 
                  key={opt} 
                  value={opt} 
                  className="bg-white dark:bg-slate-900 text-black dark:text-white font-bold"
                >
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 2. Pagination Nav Buttons */}
      <div className="flex items-center gap-1.5">
        {/* First Page */}
        <button
          onClick={() => handlePageClick(1)}
          disabled={safeCurrentPage <= 1}
          className="p-1.5 rounded-xl btn-secondary text-black dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title="First Page"
          aria-label="Go to first page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => handlePageClick(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
          className="p-1.5 rounded-xl btn-secondary text-black dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title="Previous Page"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (typeof page === 'string') {
              return (
                <span 
                  key={`ellipsis-${idx}`} 
                  className="px-2 py-1 text-xs opacity-60 font-bold select-none text-black dark:text-white"
                >
                  …
                </span>
              );
            }

            const isActive = page === safeCurrentPage;
            return (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`min-w-[32px] h-8 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isActive
                    ? 'btn-primary shadow-xs text-white'
                    : 'btn-secondary text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                aria-label={`Page ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          onClick={() => handlePageClick(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= totalPages}
          className="p-1.5 rounded-xl btn-secondary text-black dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title="Next Page"
          aria-label="Go to next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={safeCurrentPage >= totalPages}
          className="p-1.5 rounded-xl btn-secondary text-black dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title="Last Page"
          aria-label="Go to last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

export default Pagination;
