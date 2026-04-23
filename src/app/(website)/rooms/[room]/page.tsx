import { Waiting } from '@/app/(website)/rooms/[room]/_components/waiting';
import { Breadcrumb } from '@/components/breadcrumb';
import { messagesIndex, roomsShow } from '@/service/api/watch';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Live } from './_components/live';

type Props = { params: Promise<{ room: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const room = await roomsShow((await params).room);
    return { title: `直播间：${room?.name}`, description: room?.description };
}

export default async function RoomPage({ params }: Props) {
    const room = await roomsShow((await params).room);

    if (!room) {
        redirect('/rooms');
    }

    if (room.living) {
        const message = (await messagesIndex(room.living.id)) ?? [];
        return (
            <>
                <Breadcrumb
                    className={'mb-4 max-md:hidden md:mb-8'}
                    items={[
                        { label: '全部直播间', link: '/rooms' },
                        { label: `直播间：${room.name}`, link: `/rooms/${room.id}` },
                        { label: `正在直播：${room.living.name}` },
                    ]}
                />
                <Live room={room} event={room.living} messages={message} />
            </>
        );
    }

    return (
        <>
            <Breadcrumb
                items={[
                    { label: '全部直播间', link: '/rooms' },
                    { label: `直播间：${room.name}`, link: `/rooms/${room.id}` },
                ]}
            />
            <Waiting room={room} />
        </>
    );
}
