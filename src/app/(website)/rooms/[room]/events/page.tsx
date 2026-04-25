import { Breadcrumb } from '@/components/breadcrumb';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { EventCardList } from '@/components/watch';
import { eventsIndex, roomsShow } from '@/service/api/watch';
import { Info } from 'lucide-react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

type Props = { params: Promise<{ room: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const room = await roomsShow((await params).room);
  return { title: `直播回放：${room?.name}`, description: room?.description };
}

export default async function EventsPage({ params }: Props) {
  const room = await roomsShow((await params).room);
  const events = (await eventsIndex((await params).room)) ?? [];

  if (!room) {
    redirect('/rooms');
  }

  return (
    <>
      <Breadcrumb
        className="mb-4 md:mb-8"
        items={[
          { label: '全部直播间', link: '/rooms' },
          { label: `直播间：${room.name}`, link: `/rooms/${room.id}` },
          { label: '直播回放' },
        ]}
      />
      {events.length > 0 ? (
        <div className="grid gap-x-4 gap-y-8 md:grid-cols-4">
          <EventCardList events={events} />
        </div>
      ) : (
        <Empty className="mx-auto max-w-7xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Info />
            </EmptyMedia>
            <EmptyTitle>暂无可查看的回放</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
    </>
  );
}
