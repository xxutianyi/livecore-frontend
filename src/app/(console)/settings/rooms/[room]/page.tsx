import { PageContainer } from '@/components/container';

export default function RoomPage() {
  return (
    <PageContainer
      title="直播间列表"
      subTitle="仅展示有管理权限的直播间，如有疑问请联系管理员"
      breadcrumb={[{ label: '直播间', link: '/settings/rooms' }]}
    ></PageContainer>
  );
}
