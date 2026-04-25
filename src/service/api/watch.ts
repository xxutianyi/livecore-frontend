import { axios, unpack } from '@/lib/axios';
import { LiveEvent, LiveMessage, LiveRoom } from '@/service/model';

export async function roomsIndex() {
  return unpack<LiveRoom[]>(axios.get('/api/rooms'));
}

export async function roomsShow(roomId: string) {
  return unpack<LiveRoom>(axios.get(`/api/rooms/${roomId}`));
}

export async function eventsIndex(roomId: string) {
  return unpack<LiveEvent[]>(axios.get(`/api/rooms/${roomId}/events`));
}

export async function eventsShow(eventId: string) {
  return unpack<LiveEvent>(axios.get(`/api/events/${eventId}`));
}

export async function messagesIndex(eventId: string) {
  return unpack<LiveMessage[]>(axios.get(`/api/events/${eventId}/messages`));
}

export async function messagesStore(eventId: string, content: string) {
  return unpack<LiveMessage>(axios.post(`/api/events/${eventId}/messages`, { content }));
}
