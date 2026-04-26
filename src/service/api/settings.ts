import { axios, unpack } from '@/lib/axios';
import { restApi } from '@/lib/rest';
import { LiveRoom, User, UserGroup } from '@/service/model';

export const usersApi = restApi<User>('/api/settings/users', true);
export const roomsApi = restApi<LiveRoom>('/api/settings/rooms', true);
export const groupsApi = restApi<UserGroup>('/api/settings/groups');
export async function coverUpdate(roomId: string, data?: Partial<LiveRoom>) {
  return unpack(axios.put(`/api/settings/rooms/${roomId}/cover`, data));
}
