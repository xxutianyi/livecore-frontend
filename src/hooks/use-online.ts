'use client';

import { axios } from '@/lib/axios';
import { useEffect } from 'react';

export default function useOnline(roomId: string, eventId: string, living?: boolean) {
  useEffect(() => {
    const data = { living, event_id: eventId, room_id: roomId };
    axios.post<string>('/api/presence/joined', data).then((res) => {
      localStorage.setItem('online_id', res.data);
    });

    const heartbeatInterval = setInterval(() => {
      const data = { living, event_id: eventId, room_id: roomId };
      axios.post('/api/presence/heartbeat', data);
    }, 10000);

    return () => {
      const online_id = localStorage.getItem('online_id');
      axios.post('/api/presence/leaving', { online_id });
      clearInterval(heartbeatInterval);
    };
  }, []);
}
