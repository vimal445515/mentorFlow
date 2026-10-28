import type { FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const AdminPagination: FC<AdminPaginationProps> = ({
  page,
  pageSize,
  total,
  itemLabel = "users",
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => {
      const start = Math.min(Math.max(page - 2, 1), Math.max(totalPages - 4, 1));
      return start + index;
    },
  );

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-[#EBE6DF] bg-stone-50/30 p-4 sm:flex-row">
      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
        <span>
          Showing {firstItem}–{lastItem} of {total} {itemLabel}
        </span>
        <label className="flex items-center gap-2">
          Rows per page
          <select
            aria-label="Rows per page"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-stone-200 bg-white px-2 py-1 text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <nav aria-label="Table pagination" className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            aria-label={`Page ${pageNumber}`}
            aria-current={pageNumber === page ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
            className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold ${
              pageNumber === page
                ? "bg-[#DC2626] text-white shadow-xs"
                : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          disabled={page >= totalPages || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
};
