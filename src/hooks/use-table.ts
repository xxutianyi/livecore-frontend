import type { PaginateData, TableColumn } from '@/components/data-table';
import { parseAsInteger, parseAsString, useQueryState, useQueryStates, UseQueryStatesKeysMap } from 'nuqs';
import { useEffect, useState } from 'react';

export type RequestType<TData> = (params?: Record<string, any>) => Promise<PaginateData<TData> | undefined>;

export type UseDataTableProps<TData> = {
  rowKey: keyof TData;
  request: RequestType<TData>;
  columns: TableColumn<TData>[];
  onRowSelection?: (keys: string[]) => void;
};

export type UseSimpleTableProps<TData> = {
  data: TData[];
  defaultPageSize?: number;
};

export function useDataTable<TData>({ rowKey, request, columns, onRowSelection }: UseDataTableProps<TData>) {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [size, setSize] = useQueryState('size', parseAsInteger.withDefault(10));
  const [sorts, setSorts] = useQueryState('sorts', parseAsString);
  const [search, setSearch] = useQueryState('search', parseAsString);
  const [filters, setFilters] = useQueryStates(filterableColumnsQuery());

  const [tableColumns, setTableColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [paginateData, setPaginateData] = useState<PaginateData<TData>>();

  useEffect(() => {
    request({ page, size, sorts, search, ...filters }).then(setPaginateData);
  }, [page, size, sorts, search, filters]);

  function onSelectedRowChange(newSelected: string[]) {
    setSelectedRows(newSelected);
    onRowSelection?.(newSelected);
  }

  /**
   * 可筛选的列的Query定义
   */
  function filterableColumnsQuery() {
    const state: UseQueryStatesKeysMap = {};
    getFilterableColumns().forEach((column) => {
      state[column.index] = parseAsString;
    });
    return state;
  }

  /**
   * 获取当前页数据
   */
  function getData() {
    return paginateData?.data ?? [];
  }

  /**
   * 获取当前页码
   */
  function getPage() {
    return page;
  }

  /**
   * 获取当前每页数
   */
  function getSize() {
    return size.toString();
  }

  /**
   * 获取当前搜索
   */
  function getSearch() {
    return search ?? '';
  }

  /**
   * 获取当前页的行数
   */
  function getPageRows() {
    return paginateData?.data.length ?? 0;
  }

  /**
   * 获取总页数
   */
  function getTotalPage() {
    return paginateData ? Math.ceil(paginateData?.total / size) : 1;
  }

  /**
   * 获取Row Key
   * @param dataItem
   */
  function getRowKey(dataItem: TData) {
    return dataItem[rowKey] as string;
  }

  /**
   * 获取要显示的列
   */
  function getColumns() {
    return tableColumns.filter((column) => !column.hidden);
  }

  /**
   * 获取可隐藏的列
   */
  function getHideableColumns() {
    return tableColumns.filter((column) => column.hideable || (column.title && column.dataKey));
  }

  /**
   * 获取可以筛选的列
   */
  function getFilterableColumns() {
    return columns.filter((column) => column.title && column.filter && column.filter.length > 0);
  }

  /**
   * 获取列筛选的值
   * @param column
   */
  function getFilteredValue(column: TableColumn<any>) {
    return filters[column.index];
  }

  /**
   * 获取当前筛选的原始选项
   * @param column
   */
  function getFilteredValueItem(column: TableColumn<any>) {
    return column.filter?.find((filter) => filter.value == getFilteredValue(column));
  }

  /**
   * 获取已选中的行Key
   */
  function getSelectedRows() {
    return selectedRows;
  }

  /**
   * 获取行的选中状态
   * @param dataItem
   */
  function getRowSelectedState(dataItem: TData) {
    return !!selectedRows.find((row) => row === getRowKey(dataItem));
  }

  /**
   * 获取全选的状态
   */
  function getRowSelectedAllState() {
    if (selectedRows.length === 0) return false;
    if (selectedRows.length === paginateData?.data.length) return true;
    return 'indeterminate';
  }

  /**
   * 获取列排序状态
   */
  function getSortState() {
    if (!sorts) return [];

    return sorts
      .split(',')
      .map((sort) => {
        const sortMeta = sort.split(':');

        if (sortMeta.length !== 2) return undefined;

        return { column: sortMeta[0], direction: sortMeta[1] };
      })
      .filter((value) => !!value);
  }

  /**
   * 获取列排序值
   * @param column
   */
  function getColumnSortDirection(column: TableColumn<any>) {
    return getSortState()?.find((sort) => sort.column === column.index)?.direction;
  }

  /**
   * 修改当前页面
   * @param newPage
   */
  function setNewPage(newPage: number) {
    if (newPage >= 1 && newPage <= getTotalPage()) {
      setPage(newPage);
    }
  }

  /**
   * 修改每页数量
   * @param newSize
   */
  function setNewSize(newSize: number | string) {
    if (Number(newSize) > 0) {
      setSize(Number(newSize));
    }
  }

  /**
   * 修改搜索字符串
   * @param search
   */
  function setNewSearch(search?: string) {
    setSearch(search ?? null);
  }

  /**
   * 设置列可见性
   * @param index
   * @param visible
   */
  function setColumnVisibleState(index: TableColumn<unknown>['index'], visible: boolean) {
    setTableColumns(
      tableColumns.map((column) => {
        if (column.index === index) column.hidden = !visible;
        return column;
      })
    );
  }

  /**
   * 设置行是否选中
   * @param dataItem
   * @param selected
   */
  function setRowSelectedState(dataItem: TData, selected: boolean | 'indeterminate') {
    onSelectedRowChange(
      selected ? [...selectedRows, getRowKey(dataItem)] : selectedRows.filter((row) => row !== getRowKey(dataItem))
    );
  }

  /**
   * 设置行是否全选
   * @param selected
   */
  function setRowSelectedAllState(selected: boolean | 'indeterminate') {
    onSelectedRowChange(selected && paginateData ? paginateData?.data.map(getRowKey) : []);
  }

  /**
   * 设置列排序
   * @param column
   * @param direction
   */
  function setSortState(column: string, direction?: string) {
    const currentSort = getSortState().filter((s) => s.column !== column);

    setSorts(
      (direction ? [...currentSort, { column, direction }] : currentSort)
        .map((s) => `${s.column}:${s.direction}`)
        .join(',')
    );
  }

  /**
   * 设置列筛选
   * @param index
   * @param value
   */
  function setFilterState(index: string, value?: string) {
    setFilters((prev) => ({ ...prev, [index]: value ?? null }));
  }

  return {
    getData,
    getPage,
    getSize,
    getSearch,
    getPageRows,
    getTotalPage,
    getColumns,
    getHideableColumns,
    getSelectedRows,
    getRowSelectedState,
    getRowSelectedAllState,
    getColumnSortDirection,
    getFilteredValue,
    getFilteredValueItem,
    getFilterableColumns,

    setNewPage,
    setNewSize,
    setNewSearch,
    setSortState,
    setColumnVisibleState,
    setRowSelectedState,
    setRowSelectedAllState,
    setFilterState,
  };
}

export function useSimpleTable<TData>({ data, defaultPageSize = 10 }: UseSimpleTableProps<TData>) {
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);

  function onPageSizeChange(newPageSize: string) {
    setPageSize(Number(newPageSize));
    setCurrentPage(1);
  }

  function onCurrentPageChange(newCurrentPage: number) {
    setCurrentPage(newCurrentPage);
  }

  function getPageSize() {
    return `${pageSize}`;
  }

  function getTotalPage() {
    return data.length === 0 ? 1 : Math.ceil(data.length / pageSize);
  }

  function getCurrentPage() {
    return currentPage;
  }

  function getCurrentPageData() {
    return data.slice(pageSize * (currentPage - 1), pageSize * currentPage);
  }

  function toFirstPage() {
    onCurrentPageChange(1);
  }

  function disableFirstPage() {
    return getCurrentPage() === 1;
  }

  function toLastPage() {
    onCurrentPageChange(getTotalPage());
  }

  function disableLastPage() {
    return getCurrentPage() === getTotalPage();
  }

  function toPrevPage() {
    onCurrentPageChange(getCurrentPage() - 1);
  }

  function disablePrevPage() {
    return getCurrentPage() === 1;
  }

  function toNextPage() {
    onCurrentPageChange(getCurrentPage() + 1);
  }

  function disableNextPage() {
    return getCurrentPage() === getTotalPage();
  }

  return {
    onPageSizeChange,
    getPageSize,
    getTotalPage,
    getCurrentPage,
    getCurrentPageData,
    toFirstPage,
    disableFirstPage,
    toLastPage,
    disableLastPage,
    toPrevPage,
    disablePrevPage,
    toNextPage,
    disableNextPage,
  };
}
