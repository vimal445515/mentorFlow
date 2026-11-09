import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;

  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  loadingMessage?: string;

  onRetry?: () => void;

  footer?: ReactNode;
}