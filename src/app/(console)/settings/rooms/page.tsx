import { RoomCreate } from '@/app/(console)/settings/rooms/_components/form';
import { PageContainer } from '@/components/container';
import { Metadata } from 'next';
import { RoomsTable } from './_components/table';

export const metadata: Metadata = {
  title: '直播间列表',
};

export default function RoomsPage() {
  return (
    <PageContainer
      title="直播间列表"
      subTitle="仅展示有管理权限的直播间，如有疑问请联系管理员"
      breadcrumb={[{ label: '直播间', link: '/settings/rooms' }]}
      actions={[<RoomCreate key="room-create" />]}
    >
      <RoomsTable />
    </PageContainer>
  );
}
