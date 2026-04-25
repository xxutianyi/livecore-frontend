import { Breadcrumb } from '@/components/breadcrumb';
import { eventsShow, roomsShow } from '@/service/api/watch';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Playback } from './playback';

type Props = { params: Promise<{ room: string; event: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const room = await roomsShow((await params).room);
  const event = await eventsShow((await params).event);
  return { title: `直播回放：${room?.name}-${event?.name}`, description: room?.description };
}

export default async function EventPage({ params }: Props) {
  const room = await roomsShow((await params).room);
  const event = await eventsShow((await params).event);

  if (!room || !event) {
    redirect('/rooms');
  }

  return (
    <>
      <Breadcrumb
        className="mb-4 max-md:hidden md:mb-8"
        items={[
          { label: '全部直播间', link: '/rooms' },
          { label: `直播间：${room.name}`, link: `/rooms/${room.id}` },
          { label: '直播回放', link: `/rooms/${room.id}/events` },
          { label: event.name },
        ]}
      />
      <Playback room={room} event={event} />
    </>
  );
}
