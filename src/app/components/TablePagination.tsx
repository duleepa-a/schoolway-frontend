'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TablePagination({
  totalPages = 1,
  currentPage = 1,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page); // Notify parent
    }
  };

  const renderPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages.map((page, index) =>
      page === '...' ? (
        <span key={index} className="mx-1 text-gray-400 select-none">
          ...
        </span>
      ) : (
        <button
          key={index}
          onClick={() => goToPage(Number(page))}
          className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
            currentPage === page
              ? 'bg-black text-white'
              : 'border border-border-bold-shade'
          }`}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <div className="flex flex-1 items-center justify-end gap-2 text-sm">
      <button
        onClick={() => goToPage(currentPage - 1)}
        className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer border border-border-bold-shade"
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
      </button>
      {renderPages()}
      <button
        onClick={() => goToPage(currentPage + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer border border-border-bold-shade"
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
