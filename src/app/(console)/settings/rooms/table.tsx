'use client';

import { DataTable, defineColumns } from '@/components/data-table';
import { Button } from '@/components/shadcn/button';
import { roomsResource } from '@/service/api/settings';
import { LiveRoom } from '@/service/model';
import Link from 'next/link';

export function RoomsTable() {
  const columns = defineColumns<LiveRoom>([
    {
      dataKey: 'name',
      title: '名称',
      sortable: true,
    },
    {
      dataKey: 'description',
      title: '简介',
      sortable: true,
    },
    {
      index: 'actions',
      tableRowRender: (data) => {
        return (
          <Button asChild variant="secondary">
            <Link href={`/settings/rooms/${data.id}`}>详情</Link>
          </Button>
        );
      },
    },
  ]);

  return <DataTable columns={columns} request={roomsResource.index} />;
}
