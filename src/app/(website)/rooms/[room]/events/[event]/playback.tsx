'use client';

import { VideoPlayer } from '@/components/player';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventItemList, MessageList } from '@/components/watch';
import useOnline from '@/hooks/use-online';
import { eventsIndex, messagesIndex } from '@/service/api/watch';
import { LiveEvent, LiveMessage, LiveRoom } from '@/service/model';
import { Video, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Props = { room: LiveRoom; event: LiveEvent };

export function Playback({ room, event }: Props) {
  useOnline(room.id, event.id, false);

  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [messages, setMessages] = useState<LiveMessage[]>([]);

  useEffect(() => {
    eventsIndex(room.id).then((res) => setEvents(res ?? []));
    messagesIndex(event.id).then((res) => setMessages(res ?? []));
  }, []);

  return (
    <div className="max-md:-m-4 max-md:flex-col md:flex md:gap-x-4">
      <Card className="relative aspect-video p-0 max-md:rounded-none md:w-3/4">
        <div className="absolute top-4 left-5 z-10 flex items-center space-x-2 text-gray-50 max-md:hidden">
          <Video className="inline size-4" />
          <span className="font-heading text-base font-medium">{`${room.name}-${event.name}回放`}</span>
        </div>
        {event.playback_url ? (
          <VideoPlayer src={event.playback_url} />
        ) : (
          <div className="flex h-full p-8">
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <XIcon />
                </EmptyMedia>
                <EmptyTitle>回放读取失败</EmptyTitle>
              </EmptyHeader>
            </Empty>
          </div>
        )}
      </Card>
      <Card className="relative max-md:h-[calc(100svh-64px-56.25vw)] max-md:rounded-none md:w-1/4">
        <Tabs defaultValue="events">
          <CardHeader className="-mt-3">
            <TabsList className="w-full">
              <TabsTrigger value="events">回放列表</TabsTrigger>
              <TabsTrigger value="comments">互动评论</TabsTrigger>
            </TabsList>
          </CardHeader>
          <TabsContent value="events">
            <CardContent className="absolute top-16 bottom-7 w-full border-y bg-muted/50 md:bottom-0">
              <ScrollArea className="-mr-4 h-full py-2 pr-4">
                <EventItemList current={event} events={events} />
              </ScrollArea>
            </CardContent>
          </TabsContent>
          <TabsContent value="comments">
            <CardContent className="absolute top-16 bottom-7 w-full border-y bg-muted/50 md:bottom-0">
              <ScrollArea className="-mr-4 h-full py-2 pr-4">
                <MessageList messages={messages} />
              </ScrollArea>
            </CardContent>
          </TabsContent>
        </Tabs>
        <Button className="absolute bottom-0 w-full rounded-none md:hidden" asChild>
          <Link href={`/rooms/${room.id}`}>返回直播间</Link>
        </Button>
      </Card>
    </div>
  );
}
