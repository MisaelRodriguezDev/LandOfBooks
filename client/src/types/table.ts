export interface Column<T> {
  key: keyof T;
  header: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  manager?: boolean;
  hideTimestamps: boolean;
  updatefn?: (row: T) => void;
  deletefn?: (row: T) => void;
}