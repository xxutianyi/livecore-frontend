import { PageContainer } from '@/components/container';
import type { Metadata } from 'next';
import { UserCreate } from './_components/form';
import { GroupIndex } from './_components/group';
import { UsersTable } from './_components/table';

export const metadata: Metadata = {
  title: '观众列表',
};

export default function UsersPage() {
  return (
    <PageContainer
      title="管理员列表"
      breadcrumb={[{ label: '管理员', link: '/settings/users' }]}
      actions={[<UserCreate key="user-create" />, <GroupIndex key="group-index" />]}
    >
      <UsersTable />
    </PageContainer>
  );
}
