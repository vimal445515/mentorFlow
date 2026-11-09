import type { DataTableProps } from "./types";

export function DataTable<T>({
  columns,
  data,
  getRowId,
  isLoading = false,
  error,
  emptyMessage = "No records found.",
  loadingMessage = "Loading...",
  onRetry,
  footer,
}: DataTableProps<T>) {

  const renderState = () => {
    if (isLoading) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            className="px-6 py-12 text-center text-sm text-stone-500"
          >
            {loadingMessage}
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={columns.length} className="px-6 py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
              >
                Try again
              </button>
            )}
          </td>
        </tr>
      );
    }

    if (data.length === 0) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            className="px-6 py-12 text-center text-sm text-stone-500"
          >
            {emptyMessage}
          </td>
        </tr>
      );
    }

    return data.map((row) => (
      <tr
        key={getRowId(row)}
        className="align-top transition-colors hover:bg-stone-50/80"
      >
        {columns.map((column) => (
          <td
            key={column.id}
            className={`px-6 py-4 ${column.className ?? ""}`}
          >
          {column.cell(row)}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[#EBE6DF] bg-white shadow-xs">

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">

          <thead>
            <tr className="border-b border-[#EBE6DF] bg-stone-50/50 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={`px-6 py-3.5 ${column.headerClassName ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EBE6DF] text-sm">
            {renderState()}
          </tbody>

        </table>
      </div>

      {footer}

    </section>
  );
}