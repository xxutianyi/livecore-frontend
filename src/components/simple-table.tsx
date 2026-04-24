import { TableColumn } from '@/components/data-table';
import { Button } from '@/components/shadcn/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table';
import { useSimpleTable } from '@/hooks/use-table';
import { cn } from '@/lib/utils';
import _ from 'lodash';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react';

export type SimpleTableProps<TData = any> = {
  rowKey?: keyof TData;
  data?: TData[];
  columns: TableColumn<TData>[];
  sizeOptions?: number[];
  className?: string;
};

export function SimpleTable<TData>({
  data,
  columns,
  sizeOptions,
  className,
}: SimpleTableProps<TData>) {
  const table = useSimpleTable({ data: data ?? [] });

  return (
    <div className={cn(className, 'w-full space-y-4')}>
      <div className="overflow-hidden rounded-3xl border">
        <Table className="">
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} id={column.index} colSpan={column.colSpan}>
                  {column.titleRender ? column.titleRender() : column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getCurrentPageData()?.length ? (
              table.getCurrentPageData().map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.index} colSpan={column.colSpan}>
                      {column.tableRowRender
                        ? column.tableRowRender(item)
                        : column.dataKey
                          ? (_.get(item, column.dataKey) ?? '-')
                          : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg py-2">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">每页数量</p>
              <Select value={table.getPageSize()} onValueChange={table.onPageSizeChange}>
                <SelectTrigger className="h-8 w-17.5">
                  <SelectValue placeholder={table.getPageSize()} />
                </SelectTrigger>
                <SelectContent side="top">
                  {(sizeOptions ?? [10, 20, 30, 40, 50]).map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center justify-center text-sm font-medium whitespace-nowrap">
              第&nbsp;{table.getCurrentPage()}&nbsp;页，共&nbsp;{table.getTotalPage()}
              &nbsp;页
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                onClick={table.toFirstPage}
                disabled={table.disableFirstPage()}
              >
                <span className="sr-only">第一页</span>
                <ChevronsLeftIcon className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                onClick={table.toPrevPage}
                disabled={table.disablePrevPage()}
              >
                <span className="sr-only">上一页</span>
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                onClick={table.toNextPage}
                disabled={table.disableNextPage()}
              >
                <span className="sr-only">下一页</span>
                <ChevronRightIcon className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                onClick={table.toLastPage}
                disabled={table.disableLastPage()}
              >
                <span className="sr-only">最后页</span>
                <ChevronsRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
