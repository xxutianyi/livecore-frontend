'use client';

import { axios } from '@/lib/axios';
import { configureEcho } from '@laravel/echo-react';
import dynamic from 'next/dynamic';
import Pusher from 'pusher-js';
import { PropsWithChildren } from 'react';

export const EchoProvider = dynamic(
  () => import('./echo-provider').then((m) => m.EchoProviderComponent),
  { ssr: false }
);

export function EchoProviderComponent({ children }: PropsWithChildren) {
  (window as any).Pusher = Pusher;

  configureEcho({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) ?? 80,
    wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) ?? 443,
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SHCEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    Pusher: Pusher,
    channelAuthorization: {
      customHandler: (params, callback) => {
        axios
          .post('/api/broadcasting/auth', {
            socket_id: params.socketId,
            channel_name: params.channelName,
          })
          .then((response) => {
            callback(null, response.data);
          })
          .catch((error) => {
            callback(error, null);
          });
      },
    },
  });

  return children;
}
