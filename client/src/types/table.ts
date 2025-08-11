export interface Column<T> {
  key: keyof T;
  header: string;
}

interface ExtraAction<T> {
  label: string;
  icon: React.ReactNode;
  onClick: (row: T) => void;
  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  manager?: boolean;
  hideTimestamps: boolean;
  updatefn?: (row: T) => void;
  deletefn?: (row: T) => void;
  extraActions?: ExtraAction<T>[]
}