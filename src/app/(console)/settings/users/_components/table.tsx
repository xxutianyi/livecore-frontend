'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOptions } from '@/hooks/use-options';
import { formatDatetime } from '@/lib/utils';
import { User } from '@/service/model';
import { audienceUsersApi } from '@/service/requests';
import { ColumnsDef, RequestTable } from '@winglab/react-table';
import Link from 'next/link';

export function UsersTable() {
  const { groups } = useOptions();

  const columns = ColumnsDef<User>([
    {
      dataKey: 'name',
      title: '名字',
      sortable: true,
    },
    {
      dataKey: 'phone',
      title: '手机号',
      sortable: true,
    },
    {
      dataKey: 'email',
      title: '电子邮箱',
      sortable: true,
    },
    {
      dataKey: 'online',
      title: '在线状态',
      tableRowRender: (data) => (
        <>
          {data.online && <Badge>在线</Badge>}
          {!data.online && <Badge variant="secondary">离线</Badge>}
        </>
      ),
      filters: [
        { label: '在线', value: 'true' },
        { label: '离线', value: 'false' },
      ],
    },
    {
      dataKey: 'leaving_at',
      title: '上次在线时间',
      tableRowRender: (data) => formatDatetime(data.leaving_at),
    },
    {
      index: 'groups',
      title: '分组',
      filters: groups?.map((value) => {
        return { label: value.name, value: value.id };
      }),
      tableRowRender: (data) => (
        <>
          {data.groups?.map((group, index) => (
            <span key={index}>
              {group.name}
              {index + 1 !== data.groups?.length && <>&nbsp;,&nbsp;</>}
            </span>
          ))}
        </>
      ),
    },
    {
      index: 'actions',
      tableRowRender: (data) => {
        return (
          <Button asChild variant="secondary">
            <Link href={`/settings/users/${data.id}`}>详情</Link>
          </Button>
        );
      },
    },
  ]);

  return (
    <RequestTable
      columns={columns}
      request={audienceUsersApi.index}
      onSelectChange={console.log}
      showSearchInput={true}
      saveStateToQuery={true}
    />
  );
}
