'use client';

import { VideoPlayer } from '@/components/player';
import { Card } from '@/components/ui/card';
import useOnline from '@/hooks/use-online';
import { LiveEvent, LiveMessage, LiveRoom } from '@/service/model';
import { Video } from 'lucide-react';
import { LiveMessages } from './message';

type Props = { room: LiveRoom; event: LiveEvent; messages: LiveMessage[] };

export function Live({ room, event, messages }: Props) {
  useOnline(room.id, event.id, true);

  return (
    <div className="max-md:-m-4 max-md:flex-col md:flex md:gap-x-4">
      <Card className="relative aspect-video p-0 max-md:rounded-none md:w-3/4">
        <div className="absolute top-4 left-5 z-10 flex items-center space-x-2 text-gray-50 max-md:hidden">
          <Video className="inline size-4" />
          <span className="font-heading text-base font-medium">{`${room.name}正在直播`}</span>
        </div>
        <VideoPlayer src={event.pull_url} live />
      </Card>
      <LiveMessages title={`${room.name}正在直播`} event={event} initMessages={messages} />
    </div>
  );
}
