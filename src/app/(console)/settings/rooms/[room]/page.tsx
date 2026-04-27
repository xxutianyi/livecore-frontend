import { PageContainer } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { settingsRoomsShow } from '@/service/requests';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RoomDetails } from './_components/details';
import { CoverUpdate, RoomUpdate } from './_components/form';
import { GroupIndex, GroupUpdate } from './_components/groups';

type Props = { params: Promise<{ room: string }> };

export const metadata: Metadata = {
  title: '直播间信息',
};

export default async function RoomPage({ params }: Props) {
  const room = await settingsRoomsShow((await params).room);
  if (!room) notFound();

  return (
    <PageContainer
      title="直播间信息"
      breadcrumb={[
        { label: '直播间', link: '/settings/rooms' },
        { label: room.name, link: `/settings/rooms/${room.id}` },
      ]}
      actions={[
        <RoomUpdate room={room} key="room-update" />,
        <CoverUpdate room={room} key="cover-update" />,
        <GroupUpdate room={room} key="group-update" />,
      ]}
    >
      <Separator />
      <RoomDetails room={room} />
      <Separator />
      <GroupIndex groups={room.groups} />
    </PageContainer>
  );
}
