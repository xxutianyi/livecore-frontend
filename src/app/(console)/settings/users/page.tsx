import { GroupIndex } from '@/app/(console)/settings/users/_components/group';
import { PageContainer } from '@/components/container';
import type { Metadata } from 'next';
import { UserCreate } from './_components/form';
import { UsersTable } from './_components/table';

export const metadata: Metadata = {
  title: '观众列表',
};

export default function UsersPage() {
  return (
    <PageContainer
      title="观众列表"
      subTitle="仅展示有管理权限的直播间的观众，如有疑问请联系管理员"
      breadcrumb={[{ label: '观众管理', link: '/settings/users' }]}
      actions={[<UserCreate key="user-create" />, <GroupIndex key="group-index" />]}
    >
      <UsersTable />
    </PageContainer>
  );
}
