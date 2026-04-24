import { RefreshButton } from '@/app/(website)/rooms/[room]/_components/refresh';
import { Button } from '@/components/shadcn/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/shadcn/empty';
import { LiveRoom } from '@/service/model';
import { Video } from 'lucide-react';
import Link from 'next/link';

export function Waiting({ room }: { room: LiveRoom }) {
  return (
    <Empty className="m-auto w-full">
      <EmptyMedia>
        <img alt="cover" src={room.cover} className="aspect-video max-w-sm rounded-4xl" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>{room.name}暂未开播</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">可查看直播回放</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="mb-32">
        <div className="space-x-4">
          <Button asChild>
            <Link href={`/rooms/${room.id}/events`}>
              查看回放
              <Video />
            </Link>
          </Button>
          <RefreshButton />
        </div>
      </EmptyContent>
    </Empty>
  );
}
