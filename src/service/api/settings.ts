import { axios, unpack } from '@/lib/axios';
import { LiveRoom, User, UserGroup } from '@/service/model';
import { resourceApi } from '@/service/resource';
import { DataResult } from '@winglab/react-table';

export const usersResource = resourceApi<User>('/api/settings/users');
export const roomsResource = resourceApi<LiveRoom>('/api/settings/rooms');

export async function usersIndex(params?: Record<string, any>) {
  return unpack<DataResult<User>>(axios.get('/api/settings/users', { params }));
}

export async function usersStore(data?: Partial<User>) {
  return unpack<User>(axios.post('/api/settings/users', data));
}

export async function usersShow(userId: string) {
  return unpack<User>(axios.get(`/api/settings/users/${userId}`));
}

export async function usersUpdate(userId: string, data?: Partial<User>) {
  return unpack<User>(axios.put(`/api/settings/users/${userId}`, data));
}

export async function usersDestroy(userId: string) {
  return unpack<User>(axios.delete(`/api/settings/users/${userId}`));
}

export async function userGroupsIndex() {
  return unpack<UserGroup[]>(axios.get('/api/settings/groups'));
}
