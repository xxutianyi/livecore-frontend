'use client';

import { Button } from '@/components/ui/button';
import { User } from '@/service/model';
import { settingsAdminsIndex } from '@/service/requests';
import { ColumnsDef, RequestTable } from '@winglab/react-table';
import Link from 'next/link';

export function UsersTable() {
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
      dataKey: 'role',
      title: '用户角色',
      tableRowRender: (data) => (
        <>
          {data.role === 'admin' && '系统管理员'}
          {data.role === 'room-admin' && '直播管理员'}
        </>
      ),
      filters: [
        { label: '系统管理', value: 'admin' },
        { label: '直播管理', value: 'room-admin' },
      ],
    },
    {
      index: 'actions',
      tableRowRender: (data) => {
        return (
          <Button asChild variant="secondary">
            <Link href={`/systems/users/${data.id}`}>详情</Link>
          </Button>
        );
      },
    },
  ]);

  return (
    <RequestTable
      columns={columns}
      request={settingsAdminsIndex}
      onSelectChange={console.log}
      showSearchInput={true}
      saveStateToQuery={true}
    />
  );
}
