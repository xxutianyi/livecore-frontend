import { FunctionComponent, ReactNode } from "react";
import * as _$react_jsx_runtime0 from "react/jsx-runtime";

//#region src/lib/utils.d.ts
type Filter = {
  label: string;
  value: string;
  icon?: FunctionComponent<{
    className?: string;
  }>;
};
type TableColumn<TData> = {
  index: string;
  title?: string;
  dataKey?: keyof TData | string[];
  hidden?: boolean;
  colSpan?: number;
  hideable?: boolean;
  filter?: Filter[];
  sortable?: boolean;
  titleRender?: () => ReactNode;
  tableRowRender?: (data: TData) => ReactNode;
};
declare function defineColumns<TData>(columns: Partial<TableColumn<TData>>[]): {
  index: string;
  title?: string | undefined;
  dataKey?: string[] | keyof TData | undefined;
  hidden?: boolean | undefined;
  colSpan?: number | undefined;
  hideable?: boolean | undefined;
  filter?: Filter[] | undefined;
  sortable?: boolean | undefined;
  titleRender?: (() => ReactNode) | undefined;
  tableRowRender?: ((data: TData) => ReactNode) | undefined;
}[];
//#endregion
//#region src/hooks/use-server-table.d.ts
type ServerTableHookProps<TData> = {
  rowKey: keyof TData;
  request: RequestType<TData>;
  columns: TableColumn<TData>[];
  onRowSelection?: (keys: string[]) => void;
};
declare function useServerTable<TData>({
  rowKey,
  request,
  columns,
  onRowSelection
}: ServerTableHookProps<TData>): {
  getData: () => TData[];
  getPage: () => number;
  getSize: () => string;
  getSearch: () => string;
  getPageRows: () => number;
  getTotalPage: () => number;
  getColumns: () => TableColumn<TData>[];
  getHideableColumns: () => TableColumn<TData>[];
  getSelectedRows: () => string[];
  getRowSelectedState: (dataItem: TData) => boolean;
  getRowSelectedAllState: () => boolean | "indeterminate";
  getColumnSortDirection: (column: TableColumn<any>) => string | undefined;
  getFilteredValue: (column: TableColumn<any>) => any;
  getFilteredValueItem: (column: TableColumn<any>) => Filter | undefined;
  getFilterableColumns: () => TableColumn<TData>[];
  setNewPage: (newPage: number) => void;
  setNewSize: (newSize: number | string) => void;
  setNewSearch: (search?: string) => void;
  setSortState: (column: string, direction?: string) => void;
  setColumnVisibleState: (index: TableColumn<unknown>["index"], visible: boolean) => void;
  setRowSelectedState: (dataItem: TData, selected: boolean | "indeterminate") => void;
  setRowSelectedAllState: (selected: boolean | "indeterminate") => void;
  setFilterState: (index: string, value?: string) => void;
};
//#endregion
//#region src/components/server-table.d.ts
type PaginateData<T = unknown> = {
  data: T[];
  total: number;
};
type WithTable<TData, Props = unknown> = Props & {
  table: ReturnType<typeof useServerTable<TData>>;
};
type RequestType<TData> = (params?: Record<string, any>) => Promise<PaginateData<TData> | undefined>;
type ServerTableProps<TData = any> = {
  rowKey?: keyof TData;
  columns: TableColumn<TData>[];
  request: RequestType<TData>;
  sizeOptions?: number[];
  showSearch?: boolean;
  showPageNumbers?: boolean;
  onRowSelection?: (keys?: string[]) => void;
  className?: string;
  toolbarAction?: ReactNode;
};
declare function ServerTable<TData>({
  rowKey,
  columns,
  request,
  sizeOptions,
  onRowSelection,
  toolbarAction,
  className,
  showSearch,
  showPageNumbers
}: ServerTableProps<TData>): _$react_jsx_runtime0.JSX.Element;
//#endregion
//#region src/components/simple-table.d.ts
type SimpleTableProps<TData = any> = {
  rowKey?: keyof TData;
  data?: TData[];
  columns: TableColumn<TData>[];
  sizeOptions?: number[];
  className?: string;
};
declare function SimpleTable<TData>({
  data,
  columns,
  sizeOptions,
  className
}: SimpleTableProps<TData>): _$react_jsx_runtime0.JSX.Element;
//#endregion
export { PaginateData, RequestType, ServerTable, ServerTableProps, SimpleTable, SimpleTableProps, type TableColumn, WithTable, defineColumns };
//# sourceMappingURL=index.d.ts.map