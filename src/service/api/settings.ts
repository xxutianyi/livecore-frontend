import { LiveRoom, User } from '@/service/model';
import { resourceApi } from '@/service/resource';

export const usersResource = resourceApi<User>('/api/settings/users');
export const roomsResource = resourceApi<LiveRoom>('/api/settings/rooms');
