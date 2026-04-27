'use client';

import { Button } from '@/components/ui/button';
import { LiveRoom } from '@/service/model';
import { settingsRoomsIndex } from '@/service/requests';
import { ColumnsDef, RequestTable } from '@winglab/react-table';
import Link from 'next/link';

export function RoomsTable() {
  const columns = ColumnsDef<LiveRoom>([
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

  return (
    <RequestTable
      columns={columns}
      request={settingsRoomsIndex}
      onSelectChange={console.log}
      showSearchInput={true}
      saveStateToQuery={true}
    />
  );
}
